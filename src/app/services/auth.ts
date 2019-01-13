/* eslint-disable react/no-unused-state */ // It doesn't understand value={this.state}
import { LOGIN_URL } from '../config';
import fetch from '../utils/fetch';
import createContext from '../utils/create-context';

const createAuthService = ({ url }) => {
  if (!url) {
    throw new Error('No url supplied to auth service');
  }

  return {
    // TODO generic form poster instead of this?
    login: async (credentials) => {
      const { body } = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(credentials).toString(),
      });
      return body;
    },
  };
};

const service = createAuthService({
  url: LOGIN_URL,
});

const { Provider, Consumer } = createContext(service);

export { Provider };
export default Consumer;
