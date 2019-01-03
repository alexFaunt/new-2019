import * as  path from 'path';

export default {
  client: 'postgresql',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_ADMIN_USER,
    password: process.env.POSTGRES_ADMIN_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  seeds: {
    directory: __dirname,
  },
  debug: false,
};
