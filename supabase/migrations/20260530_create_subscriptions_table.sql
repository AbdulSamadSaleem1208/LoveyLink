-- LoveyLink: admin_roles + subscriptions (payment approval → premium)
-- Run entire script in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- admin_roles (required by admin dashboard + subscription RLS policies)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'moderator',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_roles_user_id_key ON public.admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own admin role" ON public.admin_roles;
CREATE POLICY "Users can read own admin role"
  ON public.admin_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (server actions) bypasses RLS for inserts/updates.

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  plan_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT subscriptions_stripe_subscription_id_key UNIQUE (stripe_subscription_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status_period_end
  ON public.subscriptions(status, current_period_end)
  WHERE status = 'active';

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS subscription_id TEXT;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Expiration helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.expire_old_subscriptions()
RETURNS TABLE(expired_count INTEGER) AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  WITH updated_subs AS (
    UPDATE public.subscriptions
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'active' AND current_period_end < NOW()
    RETURNING user_id
  )
  UPDATE public.users
  SET subscription_status = 'free', updated_at = NOW()
  FROM updated_subs
  WHERE users.id = updated_subs.user_id;

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN QUERY SELECT affected_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.expire_user_subscription(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.subscriptions
  SET status = 'expired', current_period_end = NOW(), updated_at = NOW()
  WHERE user_id = target_user_id AND status = 'active';

  UPDATE public.users
  SET subscription_status = 'free', updated_at = NOW()
  WHERE id = target_user_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.expire_old_subscriptions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.expire_user_subscription(UUID) TO authenticated;

-- ---------------------------------------------------------------------------
-- Grant yourself admin (run once; replace with your auth user id + email)
-- Find user id: Supabase → Authentication → Users → copy UUID
--
-- INSERT INTO public.users (id, email, subscription_status)
-- VALUES ('YOUR-USER-UUID', 'you@example.com', 'free')
-- ON CONFLICT (id) DO NOTHING;
--
-- INSERT INTO public.admin_roles (user_id, role)
-- VALUES ('YOUR-USER-UUID', 'super_admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
-- ---------------------------------------------------------------------------
