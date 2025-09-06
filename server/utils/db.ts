import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool() {
  if (!pool) {
    const config = useRuntimeConfig();
    pool = mysql.createPool({
      port: config.mysqlPort,
      host: config.mysqlHost,
      user: config.mysqlUser,
      database: config.mysqlDatabase,
      password: config.mysqlPassword,
      connectionLimit: 10,
    });
  }
  return pool;
}

export { getPool as pool };

export default {
  salt: 'salt',
};