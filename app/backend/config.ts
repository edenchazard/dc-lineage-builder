export default {
  clientSecret: process.env.CLIENT_SECRET ?? '',
  port: 3000,
  appUrl: '.',
  apiUrl: './api',
  db: {
    port: 3306,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
  },
  salt: 'salt',
};
