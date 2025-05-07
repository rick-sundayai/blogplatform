/**
 * Authentication constants and utilities
 */

/**
 * The ID of the admin user
 * This is loaded from the NEXT_PUBLIC_ADMIN_USER_ID environment variable
 * Make sure to add this to your .env.local file
 */
export const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID || '';

/**
 * Check if a user ID is the admin user
 * @param userId The user ID to check
 * @returns True if the user is the admin, false otherwise
 */
export function isAdminUser(userId?: string | null): boolean {
  if (!userId) return false;
  return userId === ADMIN_USER_ID;
}
