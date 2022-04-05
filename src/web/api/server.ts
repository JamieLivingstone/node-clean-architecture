import { makeContainer } from '@web/crosscutting/container';
import { makeApplication } from './app';

const dependencies = makeContainer();
const PORT = Number(process.env.PORT) || 3000;

makeApplication(dependencies).listen(PORT, function applicationStarted() {
  dependencies.logger.info({ detail: `Application running at: http://localhost:${PORT}/api-docs` });
});
