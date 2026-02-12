// Mock database module for localStorage-based storage
// No PostgreSQL connection needed

// Export mock pool for compatibility
export const pool = {
  connect: async () => ({
    query: async () => ({ rows: [] }),
    release: () => { },
  }),
  query: async () => ({ rows: [] }),
};

// Export mock db for compatibility
export const db = null as any;

export async function testConnection(): Promise<boolean> {
  console.log('✅ Using localStorage - no database connection needed');
  return true;
}
