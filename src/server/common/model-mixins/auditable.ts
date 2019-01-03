import { Plugin } from 'objection';

const plugin = (Model) => class extends Model {
  protected async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.created_at = new Date();
  }

  protected async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updated_at = new Date();
  }
};

export default plugin as Plugin;
