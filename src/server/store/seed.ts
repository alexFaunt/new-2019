
import * as knex from 'knex';

import knexConfig from './config';
import users from './data/users';
import createLogger from '../common/logger';

const logger = createLogger('store/seed');

async function seed(db) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Do NOT run this command on non development environments - you almost deleted all the data!');
  }

  logger.info('clearing down');
  await db('app.users').del();
  await db.raw('ALTER SEQUENCE app.users_id_seed RESTART WITH 1');
  logger.info('clear down complete');

  logger.info('Seeding');

  logger.info('seeding users');
  const userInserts = users.map(async ({ credentials, tokens, ...user }) => {
    const [id] = await db('app.users').insert(user).returning('id');

    await db('app.credentials').insert({ user_id: id, ...credentials });
    if (tokens) {
      await db('app.tokens').insert({ user_id: id, ...tokens });
    }
  });
  await Promise.all(userInserts);
  logger.info('seeding users');

  logger.info('Seeding complete');
}

async function run() {
  try {
    await seed(knex(knexConfig));

    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(-1);
  }
}

run();
