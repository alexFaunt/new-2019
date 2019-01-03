import server from './server';
import migrate from './server/store';
import createLogger from './server/common/logger';

const logger = createLogger('src');

const uncaughtError = (error) => {
  logger.error('[FATAL]', error);
  process.exit(-1);
};

process.on('uncaughtException', uncaughtError);
process.on('unhandledRejection', uncaughtError);

// TODO convict
const config = {
  ...process.env,
  ALLOW_AUTOMATIC_MIGRATIONS: false,
};

async function run() {
  try {
    await migrate(config);
    await server(config);
  } catch (error) {
    uncaughtError(error);
  }
}

run();
