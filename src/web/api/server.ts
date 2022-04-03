import { makeApplication } from './app';

const PORT = process.env.PORT || 3000;

makeApplication().listen(PORT, function applicationStarted() {
  console.log(`Application running at: http://localhost:${PORT}`);
});
