import { createClient } from '@vercel/postgres';

function resolveConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL
  );
}

export function getClient() {
  const connectionString = resolveConnectionString();

  if (!connectionString) {
    throw new Error(
      'No database connection string found. Expected one of: DATABASE_URL, POSTGRES_URL, DATABASE_URL_UNPOOLED, POSTGRES_URL_NON_POOLING, NEON_DATABASE_URL.'
    );
  }

  return createClient({ connectionString });
}
