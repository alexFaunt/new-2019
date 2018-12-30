/* eslint-disable no-process-env */
/* eslint-disable no-console */

import * as path from 'path';
import *  as semver from 'semver-compare';

import { version } from '../../../package.json';

export default (pathname, definition) => {
  if (!pathname) {
    throw new Error('Must provide a pathname for the migration');
  }
  if (!definition) {
    throw new Error('Must provide a definition for the migration');
  }
  if (!definition.requires) {
    throw new Error('Must provide a minimum version for the migration');
  }
  if (!definition.migration) {
    throw new Error('Must provide a migration function');
  }

  const name = path.basename(pathname, path.extname(pathname));

  if (!name) {
    throw new Error('Must provide a name for the migration');
  }

  const { requires, migration } = definition;
  const environment = process.env.NODE_ENV;

  return {
    up: async (knex) => {
      if (semver(version, requires) !== 0 && process.env.ALLOW_UNSAFE_DEPLOYMENTS !== 'true') {
        throw new Error(`Unsatisfied migration requirement. Required version: ${requires}, running: ${version}`);
      }

      const notification = `Running migration "${name}" on ${environment}`;
      console.info(`[migrator] ${notification}`);

      const knexer = (table) => knex(table).withSchema('app');
      const proxy = new Proxy(knexer, {
        get: (target, prop) => (
          prop === 'schema' ? knex.schema.withSchema('app') : knex[prop]
        ),
      });
      return migration(proxy);
    },
    down: async () => {
      throw new Error('Database rollbacks are not allowed');
    },
  };
};
