/* eslint-disable no-console */

import * as knex from 'knex';

import knexConfig from './config';

function report(appliedMigrations) {
  if (appliedMigrations !== Number.MIN_SAFE_INTEGER) {
    const versions = Math.abs(appliedMigrations);
    const position = appliedMigrations > 0 ? 'ahead' : 'behind';

    console.info(`[migrator] DB is ${versions} versions ${position}`);
  } else {
    console.info(`[migrator] DB is not initialised`);
  }
}

export default async function migrator(configuration) {
  // Let's assume we have a User entity that has a first_name and a last_name
  // in the database. We want to rename the last_name column into surname, without
  // any downtime. If we do everything at once all instances running the old service
  // during the deployment will keep accessing last_name column, generating errors.
  //
  // Instead, to make the change backward compatible we need to split the it into
  // different steps, keeping two assumptions:
  // - We don’t allow database rollbacks. Not doing them simplifies the deployment
  //   process (some database rollbacks are close to impossible like rolling back
  //   a delete).
  // - We allow to rollback the application, as long as application and database are
  //   compatible (Usually one version).
  //
  // Therefore let's assume the following plan:
  // 1.  Deploy version 1.0.0 of the application with v1 of db schema
  //     (column name = last_name)
  // 2.  Deploy version 1.0.1 of the application that saves data to
  //     last_name and surname columns. The app reads from last_name
  //     column. Db is in version v2 containing both last_name and
  //     surname columns. The surname column is a copy of the last_name
  //     column. (NOTE: this column must not have the not null constraint)
  // 3.  Deploy version 1.0.2 of the application that saves data only to
  //     surname and reads from surname. As for the db the NOT NULL constraint
  //     is dropped from last_name. Db is now in version v3
  // 4.  Deploy version 1.0.3 of the application - there are no changes in
  //     the code. Deploy db in v4 that preforms a final migration
  //     for removing the last_name column. Here you can add any missing
  //     constraints.
  //
  // Having this, we can keep track of version incompatibilities, triggering
  // migrations or blocking a deployment when needed.
  const knexInstance = knex(knexConfig);

  const version = await knexInstance.migrate.currentVersion();

  const appliedMigrations = version !== 'none' ? await knexInstance.migrate.status() : Number.MIN_SAFE_INTEGER;

  report(appliedMigrations);

  // If the database is more than one version ahead means that we're rolling back
  // to old application versions while keeping a new DB running. It's not possible
  // to ensure compatibility, so force a failure instead of allowing the deployment
  // go ahead.
  // If we have more than one migration pending, it might or might not be OK. So keep
  // going and let head migration to decide by itself.
  if (appliedMigrations > 1) {
    throw new Error('Unsatisfied migration requirement. Cannot rollback code beyond a migration');
  }

  const needMigrations = appliedMigrations < 0;
  if (!needMigrations) {
    return;
  }

  // In development we might want to wait until migrations are ready before applying them, since
  // a migration cannot be applied twice, annoying the developer. If this happens in production
  // though it's most likely a mistake, because deploying without the DB changes is worse than
  // deploying an unsafe migration alone since it will cause a full outage
  if (!configuration.ALLOW_AUTOMATIC_MIGRATIONS && !configuration.ALLOW_UNSAFE_DEPLOYMENTS) {
    throw new Error('Unsatisfied migration requirement. Cannot deploy without applying changes.');
  }

  // A lock system is there to prevent multiple processes from running the same
  // migration batch in the same time. When a batch of migrations is about to
  // be run, the migration system first tries to get a lock using a SELECT ...
  // FOR UPDATE statement (preventing race conditions from happening). If it
  // can get a lock, the migration batch will run. If it can't, it will wait
  // until the lock is released.
  // Note that if the process crashes the lock will have to be manually removed
  // in order to let migrations run again. The locks are saved in a table called
  // "tableName_lock"; it has single one column called is_locked that you need
  // to set to 0 in order to release the lock.
  if (configuration.ALLOW_AUTOMATIC_MIGRATIONS) {
    console.info('[migrator] Running migrations');
    await knexInstance.migrate.latest();
  } else {
    console.info('[migrator] Migrations WILL NOT run automatically');
  }
}
