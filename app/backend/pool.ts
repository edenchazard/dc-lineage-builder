import mysql from 'mysql2/promise';
import useConfig from './useConfig.js';

const config = useConfig();
export default mysql.createPool({
  ...config.db,
  connectionLimit: 10,
});
