export default {
  APIKey: process.env.APIKey ?? '',
  port: 3000,
  appUrl: process.env.VITE_APP_URL ?? '/',
  apiUrl: process.env.VITE_API_URL ?? '/api',
  db: {
    port: 3306,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
  },
  salt: 'salt',
};
