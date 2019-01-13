import createContext from '../utils/create-context';

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

const contextCreator = (update) => ({
  ...initialState,

  setAuth: (authorization) => {
    const newState = {
      loggedIn: true,
      authorization,
    };

    update(newState);

    persist(newState);

    return newState;
  },

  clear: () => {
    update(emptyState);

    purge();
  },
});

const { Consumer, Provider } = createContext(contextCreator);

export { Provider };
export default Consumer;
