import { compose, Model } from 'objection';

import auditableMixin from '../../../common/model-mixins/auditable';
import snakeCaseMixin from '../../../common/model-mixins/snake-case';
import UserModel from './user';

const mixins = compose(
  auditableMixin,
  snakeCaseMixin,
);

export default class TokenModel extends mixins(Model) {
  public static tableName = 'tokens';

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'tokens.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
