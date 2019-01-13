import * as React from 'react';

import { Provider as AuthStateProvider } from './auth';

// TODO make this search the folder and add them all?
const State = ({ children }) => (
  <AuthStateProvider>
    { children }
  </AuthStateProvider>
);

export default State;
