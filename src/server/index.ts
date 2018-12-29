import server from './server';
// TODO absolute imports - Vscode understands but nodemon ts-node does not

const uncaughtError = (error) => {
  console.error('[FATAL]', error);
  process.exit(-1);
};

process.on('uncaughtException', uncaughtError);
process.on('unhandledRejection', uncaughtError);

// TODO convict
const config = {
  PORT: 8000,
};

async function run() {
  try {
    await server(config);
  } catch (error) {
    uncaughtError(error);
  }
}

run();
