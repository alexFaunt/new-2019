import validation, { validator } from '../../utils/validation';
import { compare } from './passwords';
import { generate } from './tokens';

const validateLogin = validator(validation.object().keys({
  email: validation.string().email().required(),
  password: validation.string().min(8).required(),
}));

interface ILogin {
  email: string;
  password: string;
}

export default ({ UserModel }) => () => async (ctx) => {
  const { email, password }: ILogin = validateLogin(ctx.request.body);

  const users = await UserModel.query().select('*').where({ email }).eager('[credential]');

  if (users.length === 1 && users[0].credential && await compare(users[0].credential.password, password)) {
    const token = await generate();

    // Basic implementation of token storage - you can only be logged in on one device
    await UserModel.query().upsertGraph({ id: users[0].id, token: { token } }).returning('*');

    ctx.body = {
      success: true,
      authorization: `Bearer ${token}`,
    };
    return;
  }

  ctx.status = 400;
  ctx.body = {
    message: 'failed',
    success: false,
    authorization: null,
  };
};
