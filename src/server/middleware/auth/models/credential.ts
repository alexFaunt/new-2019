import { compose, Model } from 'objection';

import auditableMixin from '../../../common/model-mixins/auditable';
import snakeCaseMixin from '../../../common/model-mixins/snake-case';
import UserModel from './user';
// import { validator } from 'src/utils/validation';

// TODO implement these mixins
// TODO do the user model and sort out the login/authenticate stuff
// TODO do convict
// TODO do register and stuff

const mixins = compose(
  // ValidatableModel,
  auditableMixin,
  snakeCaseMixin,
);

export default class CredentialModel extends mixins(Model) {
  public static tableName = 'credentials';

  // public static schema = {
  //   id: validator.increment(),
  //   url: validator.uri().max(255).required(),
  //   horizontalAlignment: validator.enum(['LEFT', 'CENTER', 'RIGHT']).default('CENTER'),
  //   verticalAlignment: validator.enum(['TOP', 'CENTER', 'BOTTOM']).default('CENTER'),
  // };

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'credentials.user_id',
          to: 'users.id',
        },
      },
    };
  }
}
