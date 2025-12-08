import mysql from 'mysql2/promise';

const config = useRuntimeConfig();

export default mysql.createPool({
  ...config.db,
  connectionLimit: 10,
});
