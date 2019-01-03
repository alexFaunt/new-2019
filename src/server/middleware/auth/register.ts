import validation, { validator } from '../../utils/validation';
import { generate } from './tokens';

const validateRegister = validator(validation.object().keys({
  email: validation.string().email().required(),
  password: validation.string().min(8).required(),
}));

interface IRegister {
  email: string;
  password: string;
}

export default ({ UserModel }) => () => async (ctx) => {
  const { email, password }: IRegister = validateRegister(ctx.request.body);

  const users = await UserModel.query().select('*').where({ email });

  if (users.length) {
    ctx.status = 400;
    ctx.body = {
      message: 'failed',
      success: false,
      token: null,
    };

    return;
  }

  const token = await generate();

  // Basic implementation of token storage - you can only be logged in on one device
  await UserModel.query().insertGraph({ email, credential: { password }, token: { token } }).returning('*');

  ctx.body = {
    message: 'registered',
    success: true,
    token,
  };
};
