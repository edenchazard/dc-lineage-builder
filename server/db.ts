import mysql, { type PoolConnection } from 'mysql2/promise';

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/** Vitest runs outside Nitro, so fall back to the same env vars used by runtime config. */
function dbConfigFromEnv(): DbConfig {
  const env = process.env;

  return {
    host: env.NUXT_DB_HOST ?? env.MYSQL_HOST ?? '',
    port: Number(env.NUXT_DB_PORT ?? env.MYSQL_PORT ?? 3306),
    user: env.NUXT_DB_USER ?? env.MYSQL_USER ?? '',
    password: env.NUXT_DB_PASSWORD ?? env.MYSQL_PASSWORD ?? '',
    database: env.NUXT_DB_DATABASE ?? env.MYSQL_DATABASE ?? '',
  };
}

const config =
  typeof useRuntimeConfig === 'function'
    ? useRuntimeConfig().db
    : dbConfigFromEnv();

export const pool = mysql.createPool({
  ...config,
  connectionLimit: 20,
  multipleStatements: true,
});

/** Runs `fn` in a transaction, committing on success or rolling back on error. */
export async function databaseTransaction<T>(
  fn: (transaction: PoolConnection) => Promise<T>,
): Promise<T> {
  const con = await pool.getConnection();

  try {
    await con.beginTransaction();

    const result = await fn(con);

    await con.commit();

    return result;
  } catch (err) {
    await con.rollback();
    throw err;
  } finally {
    con.release();
  }
}
