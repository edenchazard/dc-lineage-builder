import mysql from 'mysql2/promise';
import config from './config.js';

export default mysql.createPool({
  ...config.db,
  connectionLimit: 10,
});
