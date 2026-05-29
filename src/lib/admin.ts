/** Owner emails with full admin access (comma-separated in env). */
const DEFAULT_OWNER_EMAILS = ['moizkiani@loveylink.com']

export function getOwnerEmails(): string[] {
    const fromEnv = process.env.ADMIN_OWNER_EMAILS || process.env.NEXT_PUBLIC_ADMIN_OWNER_EMAIL
    if (fromEnv) {
        return fromEnv.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    }
    return DEFAULT_OWNER_EMAILS.map((e) => e.toLowerCase())
}

export function isOwnerEmail(email: string | null | undefined): boolean {
    if (!email) return false
    return getOwnerEmails().includes(email.toLowerCase())
}

export function isAdminRole(role: string | null | undefined): boolean {
    return role === 'admin' || role === 'super_admin' || role === 'moderator'
}

export const PREMIUM_PLAN_ID = 'monthly_pkr_500'
export const PREMIUM_AMOUNT_PKR = 500

export function formatSubscriptionStatus(status: string | null | undefined): {
    label: string
    className: string
} {
    switch (status) {
        case 'active':
            return { label: 'Active', className: 'bg-green-100 text-green-800' }
        case 'past_due':
            return { label: 'Past due', className: 'bg-yellow-100 text-yellow-800' }
        case 'canceled':
            return { label: 'Canceled', className: 'bg-red-100 text-red-800' }
        case 'free':
            return { label: 'Free', className: 'bg-gray-100 text-gray-700' }
        default:
            return { label: status || 'Unknown', className: 'bg-gray-100 text-gray-600' }
    }
}
