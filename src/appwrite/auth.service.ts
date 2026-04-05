import { Client, Account, ID } from 'appwrite';
import conf from '../conf/conf';
import { sanitizeUser, type AuthUser } from '../types/auth';

/**
 * AuthService — Appwrite wrapper and abstraction layer
 *
 * Purpose:
 * - Centralize authentication operations (signup, login, logout, current user).
 * - Prevent vendor lock-in by decoupling application code from the Appwrite SDK.
 *
 * What is vendor lock-in:
 * - Vendor lock-in occurs when implementation details from a provider (SDK calls,
 *   types, or deeply coupled behaviors) are scattered across your codebase.
 * - If you later switch providers (e.g., Firebase, Supabase), every call-site will
 *   need updates — making migrations costly and error-prone.
 *
 * How this wrapper prevents vendor lock-in:
 * - All provider-specific code lives inside this service. Components and modules
 *   import and call `authService` methods instead of directly using Appwrite.
 * - To replace Appwrite, update this file (and any provider-specific helpers)
 *   and keep the public method signatures the same. Call-sites remain unchanged.
 *
 * Usage:
 * - Import `authService` and call `authService.login(...)`, `authService.signup(...)`,
 *   `authService.getCurrentUser()`, or `authService.logout()`.
 */


 class AuthService {
    // Appwrite client and account instances are kept private to this wrapper
  private readonly client: Client = new Client();
  private readonly account: Account;

    constructor() {
        // Configure the Appwrite client using centralized configuration
        this.client.setEndpoint(conf.appwriteEndpoint);
        this.client.setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    /**
     * Create a new user and immediately create a session.
     * Note: we return the result of `login` so the app receives a session object.
     * Keeping this logic here means callers never need to know how user creation
     * and session creation are implemented by the provider.
     */
    async signup(email: string, password: string, name: string) {
        const user = await this.account.create({ userId: ID.unique(), email, password, name });
        if (!user) {
            throw new Error('User creation failed');
        }

        // After creating the user, create a session so the app is signed-in.
        return this.login(email, password);
    }

    /**
     * Create an email/password session.
     * Abstracts Appwrite's session creation so callers remain provider-agnostic.
     */
    async login(email: string, password: string) {
        return this.account.createEmailPasswordSession({ email, password });
    }

    /**
     * Return the currently authenticated user.
     * Callers do not need to know how the provider exposes the current user.
     */
    async getCurrentUser(): Promise<AuthUser | null> {
        try {
            const user = await this.account.get();
            return sanitizeUser(user);
        } catch (error) {
            console.log("Appwrite auth service :: getCurrentUser :: error",error)
            return null
        }
    }

    /**
     * Logout the user from all sessions (global logout).
     * Keep this detail encapsulated so call-sites can simply request a logout.
     */
    async logout() {
        try {
            // Global logout — deletes all sessions for the current user
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite auth service :: logout :: error",error)
            return null
        }
    }
}

const authService = new AuthService();
export default authService