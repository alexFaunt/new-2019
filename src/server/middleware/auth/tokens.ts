import { randomBytes } from 'crypto';

const TOKEN_LENGTH = 127;

export const generate = () => new Promise((resolve) => {
  randomBytes(TOKEN_LENGTH, (err, buffer) => {
    const token = buffer.toString('hex');
    resolve(token);
  });
});
