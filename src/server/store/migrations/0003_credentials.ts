import migrator from '../utils/migrator';
import createId from '../utils/create-id';

export const { up, down } = migrator(__filename, {
  requires: '1.0.0',
  migration: async (knex) => {
    await knex.schema.createTable('credentials', (table) => {
      table.string('user_id');
      table.string('password').notNullable();
      table.timestamps(true, true);

      table.foreign('user_id').references('id').inTable('app.users');
      table.primary('user_id');
    });

    await knex.schema.createTable('tokens', (table) => {
      table.increments('id'); // Do not use this for anything it's just for
      table.string('user_id');
      table.string('token').notNullable();
      table.timestamps(true, true);

      table.foreign('user_id').references('id').inTable('app.users');
      table.unique('token');
    });
  },
});
