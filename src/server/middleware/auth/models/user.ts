import { compose, Model } from 'objection';
import auditableMixin from '../../../common/model-mixins/auditable';
import snakeCaseMixin from '../../../common/model-mixins/snake-case';
import CredentialModel from './credential';
import TokenModel from './token';

const mixins = compose(
  auditableMixin,
  snakeCaseMixin,
);

export default class UserModel extends mixins(Model) {
  public static tableName = 'users';

  static get relationMappings() {
    return {
      credential: {
        relation: Model.HasOneRelation,
        modelClass: CredentialModel,
        join: {
          from: 'users.id',
          to: 'credentials.user_id',
        },
      },
      token: {
        relation: Model.HasOneRelation,
        modelClass: TokenModel,
        join: {
          from: 'users.id',
          to: 'tokens.user_id',
        },
      },
    };
  }
}
