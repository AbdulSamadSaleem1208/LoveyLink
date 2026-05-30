-- Remove a duplicated last word in full_name (e.g. "Abdul Samad Saleem Saleem" -> "Abdul Samad Saleem").
-- Run in Supabase SQL Editor. Safe to run more than once.

UPDATE public.users
SET
  full_name = trim(
    regexp_replace(
      regexp_replace(trim(full_name), '\s+', ' ', 'g'),
      ' (\S+) \1$',
      ' \1',
      'i'
    )
  ),
  updated_at = now()
WHERE
  full_name IS NOT NULL
  AND full_name ~ ' (\S+) \1$';
