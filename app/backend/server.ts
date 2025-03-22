import app from './app.js';

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

app.listen(3000, () => console.info(`Listening to http://localhost:3000 🚀`));

export default app;
