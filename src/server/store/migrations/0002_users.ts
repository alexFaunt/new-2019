import migrator from '../utils/migrator';
import createId from '../utils/create-id';

export const { up, down } = migrator(__filename, {
  requires: '1.0.0',
  migration: async (knex) => {
    await knex.schema.createTable('users', (table) => {
      table.string('email').notNullable();
      table.string('display_name');
      table.timestamps(true, true);

      table.unique('email');
    });

    await createId({ knex, table: 'users', prefix: 'usr' });
  },
});
