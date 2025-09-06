import { u as useRuntimeConfig } from '../nitro/nitro.mjs';
import mysql from 'mysql2/promise';

let pool = null;
function getPool() {
  if (!pool) {
    const config = useRuntimeConfig();
    pool = mysql.createPool({
      port: config.mysqlPort,
      host: config.mysqlHost,
      user: config.mysqlUser,
      database: config.mysqlDatabase,
      password: config.mysqlPassword,
      connectionLimit: 10
    });
  }
  return pool;
}
const config = {
  salt: "salt"
};

export { config as c, getPool as g };
//# sourceMappingURL=db.mjs.map
