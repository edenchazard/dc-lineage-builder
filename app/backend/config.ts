import path from 'path';

export default {
  clientSecret: process.env.CLIENT_SECRET ?? '',
  port: parseInt(process.env.PORT ?? '3000'),
  base: process.env.VITE_BASE_URL ?? '',
  api: path.join(process.env.VITE_BASE_URL ?? '', '/api'),
  db: {
    port: parseInt(process.env.MYSQL_PORT ?? '3306'),
    host: process.env.MYSQL_HOST ?? '',
    user: process.env.MYSQL_USER ?? '',
    database: process.env.MYSQL_DATABASE ?? '',
    password: process.env.MYSQL_PASSWORD ?? '',
  },
  salt: 'salt',
};
