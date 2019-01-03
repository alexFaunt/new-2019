import createLogin from "./login";
import createAuthorization from "./authorization";
import createRegister from "./register";
import UserModel from "./models/user";
import CredentialModel from "./models/credential";
import TokenModel from "./models/token";

export default (pool) => {
  UserModel.knex(pool);
  CredentialModel.knex(pool);
  TokenModel.knex(pool);

  const models = {
    UserModel,
    CredentialModel,
    TokenModel,
  };

  const login = createLogin(models);
  const authorization = createAuthorization(models);
  const register = createRegister(models);

  return {
    login,
    authorization,
    register,
  };
};
