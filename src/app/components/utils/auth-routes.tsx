import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { parse, stringify } from 'querystring';

import AuthState from '../../state/auth';

const createParams = ({ pathname, search }) => {
  const returnTo = `${pathname}${search.startsWith('?') ? search : ''}`;
  return stringify({ returnTo });
};

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthState>
    {({ loggedIn }) => (
      <Route
        {...rest}
        render={
          (props) => (
            loggedIn
              ? <Component {...props} />
              : <Redirect to={{ pathname: '/login', search: createParams(props.location) }} />
          )
        }
      />
    )}
  </AuthState>
);

const LoginRoute = ({ component: Component, ...rest }) => (
  <AuthState>
    {({ loggedIn }) => (
      <Route
        {...rest}
        render={(props) => {
          const locationParams = parse(props.location.search.substring(1)) || {};
          const { returnTo } = locationParams;
          const returnRoute = (returnTo || '/') as string;
          return loggedIn ? <Redirect to={returnRoute} /> : <Component {...props} />
        }}
      />
    )}
  </AuthState>
);

export {
  ProtectedRoute,
  LoginRoute,
};
