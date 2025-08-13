// Mock Nhost client for testing without backend
export const nhost = {
  auth: {
    signUp: async (email, password) => ({ session: { user: { email } }, error: null }),
    signIn: async (email, password) => ({ session: { user: { email } }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: () => ({ user: { email: 'test@example.com' } }),
  },
  graphql: {
    request: async () => ({ data: {}, error: null }),
  },
};