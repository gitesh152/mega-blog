import type { Models } from "appwrite";

export type AuthUser = Models.User<Models.Preferences>;

export  interface AuthState {
status: boolean,
userData: AuthUser | null;
}

export const sanitizeUser = (user: Models.User<Models.Preferences>): AuthUser => {
    // Appwrite User objects contain non-serializable functions.
    // Instead of structuredClone (which fails), selectively copy serializable data properties.
    const sanitized: Record<string, unknown> = {};
    for (const key in user) {
        const value = user[key as keyof typeof user];
        // Skip functions and circular references
        if (typeof value !== "function") {
            sanitized[key] = value;
        }
    }
    return sanitized as AuthUser;
};