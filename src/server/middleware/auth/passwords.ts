import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 2 ** 24;

export const compare = async (encrypted, check) => {
  const result = await bcrypt.compare(check, encrypted);

  return result;
};

export const encode = async (password) => {
  const encrypted = await bcrypt.hash(password, SALT_ROUNDS);

  return encrypted;
};
