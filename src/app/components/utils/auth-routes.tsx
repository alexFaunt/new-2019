import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { parse, stringify } from 'querystring';

import useAuthState from '../../state/auth';

const createParams = ({ pathname, search }) => {
  const returnTo = `${pathname}${search.startsWith('?') ? search : ''}`;
  return stringify({ returnTo });
};

const isBrowser = typeof window !== 'undefined';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state: { loggedIn } } = useAuthState();
  return (
    <Route
      {...rest}
      render={
        (props) => (
          loggedIn || !isBrowser
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', search: createParams(props.location) }} />
        )
      }
    />
  );
};

const LoginRoute = ({ component: Component, ...rest }) => {
  const { state: { loggedIn } } = useAuthState();
  return (
    <Route
      {...rest}
      render={(props) => {
        const locationParams = parse(props.location.search.substring(1)) || {};
        const { returnTo } = locationParams;
        const returnRoute = (returnTo || '/') as string;
        return loggedIn ? <Redirect to={returnRoute} /> : <Component {...props} />
      }}
    />
  );
};

export {
  ProtectedRoute,
  LoginRoute,
};
