import * as convict from 'convict';

const config = {
  ALLOW_AUTOMATIC_MIGRATIONS: {
    doc: 'Whether to allow API to migrate itself during deployments',
    format: Boolean,
    default: true,
  },
  ALLOW_UNSAFE_DEPLOYMENTS: {
    doc: 'Whether to allow API deployments that can cause a potential downtime',
    format: Boolean,
    default: false,
  },
  DANGEROUSLY_ALLOW_BASIC_AUTH: {
    doc: 'Dangerously allow basic auth',
    format: Boolean,
    default: false,
  },
  DEBUG_SQL_STATEMENTS: {
    doc: 'When enabled knex prints SQL statements to the console',
    format: Boolean,
    default: false,
  },
  ERROR_STACK_ENABLED: {
    doc: 'Whether the error stack should be shown or not',
    format: Boolean,
    default: false,
  },
  HTTP_COMPRESSION_ENABLED: {
    doc: 'Whether HTTP compression is enabled or not',
    format: Boolean,
    default: true,
  },
  NODE_ENV: {
    doc: 'Application environment',
    format: ['production', 'development'],
    default: 'production',
  },
  PLAYGROUND_ENABLED: {
    doc: 'Whether GraphiQL should be enabled or not',
    format: Boolean,
    default: false,
  },
  PORT: {
    doc: 'Port to bind',
    format: 'port',
    default: 8080,
  },
  POSTGRES_ADMIN_PASSWORD: {
    doc: 'Database password',
    format: String,
    default: null,
    sensitive: true,
  },
  POSTGRES_ADMIN_USER: {
    doc: 'Database user',
    format: String,
    default: null,
    sensitive: true,
  },
  POSTGRES_APP_PASSWORD: {
    doc: 'Database password',
    format: String,
    default: null,
    sensitive: true,
  },
  POSTGRES_APP_USER: {
    doc: 'Database user',
    format: String,
    default: null,
    sensitive: true,
  },
  POSTGRES_CONNECTION_TIMEOUT: {
    doc: 'Maximum Time in ms to wait for a db connection',
    format: Number,
    default: 60000,
  },
  POSTGRES_DB: {
    doc: 'Database name',
    format: String,
    default: null,
  },
  POSTGRES_HOST: {
    doc: 'Database host',
    format: String,
    default: null,
  },
  POSTGRES_POOL_MIN: {
    doc: 'Minimum number of db connections in pool',
    format: Number,
    default: 2,
  },
  POSTGRES_POOL_MAX: {
    doc: 'Maximum number of db connections in pool',
    format: Number,
    default: 10,
  },
  POSTGRES_PORT: {
    doc: 'Database port',
    format: Number,
    default: null,
  },
};

let properties = null;
export default () => {
  if (!properties) {
    const entries = Object.keys(config).reduce((acc, key) => ({
      ...acc,
      [key]: {
        ...config[key],
        env: key,
      },
    }), {});

    const configuration = convict(entries);
    configuration.validate({ allowed: 'strict' });
    properties = configuration.getProperties();
  }

  return properties;
};
