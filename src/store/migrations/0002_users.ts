import migrator from '../utils/migrator';
import createId from '../utils/create-id';

export const { up, down } = migrator(__filename, {
  requires: '1.0.0',
  migration: async (knex) => {
    await knex.schema.createTable('users', (table) => {
      table.string('email', 128).notNullable()
        .comment('The email of the user');

      table.unique('email');
    });

    await createId({ knex, table: 'users', prefix: 'usr' })
  },
});
