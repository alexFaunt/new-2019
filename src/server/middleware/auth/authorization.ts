import { compare } from './passwords';

const getToken = ({ method, request }) => {
  if (request.headers.authorization) {
    const parts = request.headers.authorization.split(' ');
    if (parts.length !== 2) {
      return null;
    }

    if (parts[0].toLowerCase() !== method) {
      return null;
    }

    return parts[1];
  }

  return null;
};

const credentialFinder = (allowedMethods) => (request) => allowedMethods.reduce((credentials, method) => {
  if (credentials.method) {
    return credentials;
  }

  const token = getToken({ method, request });

  return token ? { token, method } : credentials;
}, { method: null, token: null });

export default ({ UserModel, TokenModel }) => ({ allowedMethods }) => {
  const getCredentials = credentialFinder(allowedMethods);

  return async (ctx, next) => {
    const { method, token } = getCredentials(ctx.request);

    if (method === 'bearer') {
      const match = await TokenModel.query().first().where({ token }).eager('[user]');

      if (match) {
        ctx.state.auth = {
          user: match.user,
          permissions: {
            todo: 'bearer', // TODO
          },
        };

        return next();
      }
    }

    if (method === 'basic') {
      const [email, password] = Buffer.from(token, 'base64').toString('binary').split(':');
      const users = await UserModel.query().select('*').where({ email }).eager('[credential]');

      if (users.length === 1 && users[0].credential && await compare(users[0].credential.password, password)) {
        // decode basic token
        ctx.state.auth = {
          user: users[0],
          permissions: {
            todo: 'basic', // TODO
          },
        };

        return next();
      }

      throw new Error('Invalid basic auth');
    }

    // default permissions and no user
    ctx.state.auth = {
      user: null,
      permissions: {
        todo: 'unauth', // TODO
      },
    };

    return next();
  };
};
