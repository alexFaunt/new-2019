import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import { API_URL } from '../config';
import { getPersistedState } from '../state/auth';

export const createClient = (initialState, ssrMode = false) => {
  // Used to add out auth headers to request context before executing graphql requests
  const getContext = ({ headers = {}, ...context }) => {
    const authState = getPersistedState();

    return {
      ...context,
      headers: {
        ...headers,
        ...(authState ? { authorization: authState.authorization } : null),
      },
    };
  };

  // Create the link to fetch from the api
  const apiLink = new HttpLink({ uri: API_URL });

  // Create an auth link which reads from our auth state
  const authLink = setContext((_, context) => getContext(context));

  const cache = new InMemoryCache();

  if (initialState) {
    cache.restore(initialState);
  }

  return new ApolloClient({
    link: authLink.concat(apiLink),
    connectToDevTools: true,
    cache,
    ssrMode,
  });
};

export default createClient;
