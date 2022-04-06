import { makeContainer } from '@web/crosscutting/container';
import { makeApp } from './app';

const dependencies = makeContainer();
const PORT = Number(process.env.PORT) || 3000;

makeApp(dependencies).listen(PORT, function applicationStarted() {
  dependencies.logger.info({ detail: `Application running at: http://localhost:${PORT}/api-docs` });
});
