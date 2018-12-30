import migrator from '../utils/migrator';

export const { up, down } = migrator(__filename, {
  requires: '1.0.0',
  migration: async (knex) => {
    await knex.schema.raw(`CREATE USER app WITH PASSWORD '${process.env.POSTGRES_APP_PASSWORD}';`);
    await knex.schema.raw(`GRANT app TO ${process.env.POSTGRES_ADMIN_USER}`);
    await knex.schema.raw('CREATE SCHEMA app AUTHORIZATION app;');
    await knex.schema.raw(`ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT
      SELECT,
      INSERT,
      UPDATE,
      DELETE
    ON TABLES TO app;`);
    await knex.schema.raw('ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO app;');
    await knex.schema.raw('REVOKE CREATE ON SCHEMA public FROM app;');
  },
});
