
import * as knex from 'knex';

import knexConfig from './config';

async function run () {
  if (!process.env.ALLOW_UNSAFE_DEPLOYMENTS) {
    throw new Error('Must allow unsafe deployments to manually migrate');
  }

  const knexInstance = knex(knexConfig);

  try {
    await knexInstance.migrate.latest();

    process.exit(0);
  } catch (error) {
    process.exit(-1);
  }
}

run();
