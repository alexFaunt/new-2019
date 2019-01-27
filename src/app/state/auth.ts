import { useContext } from 'react';
import createState from '../utils/create-state';

const AUTH_KEY = 'authorization';

const emptyState = {
  loggedIn: false,
  authorization: null,
};

const persist = ({ authorization }) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_KEY, authorization);
  }
};

const purge = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_KEY);
  }
};

export const getPersistedState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const authorization = window.localStorage.getItem(AUTH_KEY);

  return authorization ? { loggedIn: true, authorization } : null;
};

const initialState = getPersistedState() || emptyState;

const actions = {
  setAuth: (state, authorization) => {
    const newState = {
      loggedIn: true,
      authorization,
    };

    persist(newState);

    return newState;
  },

  clear: () => {
    purge();

    return emptyState;
  },
};

const { context, Provider } = createState(initialState, actions);

export { Provider };
export default () => useContext(context);
