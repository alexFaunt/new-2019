import server from './server';
import migrate from './store';

const uncaughtError = (error) => {
  console.error('[FATAL]', error);
  process.exit(-1);
};

process.on('uncaughtException', uncaughtError);
process.on('unhandledRejection', uncaughtError);

// TODO convict
const config = process.env;

async function run() {
  try {
    await migrate(config);
    await server(config);
  } catch (error) {
    uncaughtError(error);
  }
}

run();
