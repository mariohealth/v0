'use client'

// Mock Supabase client for development/testing - no network requests or env vars required
export function createClient() {
  // Return a mock Supabase client that always "succeeds"
  return {
    auth: {
      signInWithPassword: async () => ({
        data: {
          session: {
            user: {
              email: "mock@mario.health",
              id: "mock-user-id",
            },
          },
        },
        error: null,
      }),
      signUp: async () => ({
        data: {
          user: {
            id: "mock-user",
            email: "mock@mario.health",
          },
        },
        error: null,
      }),
      signOut: async () => ({
        error: null,
      }),
      getSession: async () => ({
        data: {
          session: {
            user: {
              email: "mock@mario.health",
              id: "mock-user-id",
            },
          },
        },
        error: null,
      }),
      getUser: async () => ({
        data: {
          user: {
            email: "mock@mario.health",
            id: "mock-user-id",
          },
        },
        error: null,
      }),
      signInWithOAuth: async () => ({
        data: {
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}/home`,
          provider: 'google',
        },
        error: null,
      }),
      onAuthStateChange: (_event: string, callback?: (event: string, session: any) => void) => {
        // Simulate successful sign in
        if (callback && typeof callback === 'function') {
          setTimeout(() => {
            callback("SIGNED_IN", {
              session: {
                user: {
                  email: "mock@mario.health",
                  id: "mock-user-id",
                },
              },
            });
          }, 100);
        }
        return {
          data: {
            subscription: {
              unsubscribe: () => { },
            },
          },
        };
      },
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: [], error: null }),
      update: async () => ({ data: [], error: null }),
      delete: async () => ({ data: [], error: null }),
    }),
  } as any;
}
