import server from './server';
import migrate from './server/store';
import createLogger from './server/common/logger';
import createConfig from './config';

const logger = createLogger('src');

const uncaughtError = (error) => {
  logger.error(error);
  process.exit(-1);
};

process.on('uncaughtException', uncaughtError);
process.on('unhandledRejection', uncaughtError);

async function run() {
  try {
    const config = createConfig();
    await migrate(config);
    await server(config);
  } catch (error) {
    uncaughtError(error);
  }
}

run();
