export default {
  APIKey: process.env.APIKey,
  port: 3000,
  db: {
    port: 3306,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 10,
  },
  salt: 'salt',
  apiPath: `${process.env.VITE_APP_URL}api`,
  default_error: { status: 2, message: 'Sorry, an error has occurred.' },
};
