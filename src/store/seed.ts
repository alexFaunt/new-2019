import users from './data/users';

export async function seed(knex) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Do NOT run this command on non development environments - you almost deleted all the data!');
  }

  await knex('app.users').del();
  await knex.raw('ALTER SEQUENCE app.users_id_seq RESTART WITH 1');
  await knex('app.users').insert(users);
}
