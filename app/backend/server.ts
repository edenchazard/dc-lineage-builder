import app from './app';
import config from './config';

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

app.listen(config.port || 3000, () =>
  console.info(`Listening to http://localhost:${config.port} 🚀`),
);

export default app;
