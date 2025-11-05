// Extend Express Request with authenticated user properties
declare namespace Express {
  export interface Request {
    /** Supabase user object (when authenticated) */
    user?: any;
    /** Supabase user id (UUID) */
    userId?: string;
  }
}

export {};
