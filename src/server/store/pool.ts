
import * as knex from 'knex';

import createLogger from '../common/logger';

const logger = createLogger('store/pool');

interface IConnection {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface IPool {
  min: number;
  max: number;
}

interface IArguments {
  connection: IConnection;
  pool: IPool;
  acquireConnectionTimeout: number;
  debug: boolean;
}

export default ({ connection, pool, acquireConnectionTimeout, debug }: IArguments) => {
  const instance = knex({
    client: 'pg',
    connection,
    pool,
    acquireConnectionTimeout,
  });

  if (debug) {
    // Knex has a debug option to print every SQL statament ran, but it's not very good
    instance.client.on('query', (statement) => {
      const query = instance.client._formatQuery(statement.sql, statement.bindings, 'UTC');
      logger.info(query);
    });
  }

  return instance;
};
