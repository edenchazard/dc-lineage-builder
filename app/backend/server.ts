import app from './app.js';
import config from './config.js';

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

app.listen(config.port, () =>
  console.info(`
    We're live! 🚀
    Base URL: ${config.base}
    API URL: ${config.api}
    Port: ${config.port}
  `),
);

export default app;
