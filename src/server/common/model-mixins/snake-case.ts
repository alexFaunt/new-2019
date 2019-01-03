import { Plugin } from 'objection';
import { mapKeys, snakeCase, camelCase } from 'lodash/fp';

const snakeKeys = mapKeys(snakeCase);
const camelKeys = mapKeys(camelCase);

const plugin = (Model) => class extends Model {
  // This is called when an object is stored in DB
  protected $formatDatabaseJson(data: any) {
    const json = super.$formatDatabaseJson(data);

    return snakeKeys(json);
  }

  // This is called when an object is read from DB.
  protected $parseDatabaseJson(data: any) {
    const json = camelKeys(data);

    return super.$parseDatabaseJson(json);
  }
};

export default plugin as Plugin;
