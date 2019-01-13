import * as React from 'react';

import { Provider as AuthServiceProvider } from './auth';

// TODO make this search the folder and add them all?
const Services = ({ children }) => (
  <AuthServiceProvider>
    { children }
  </AuthServiceProvider>
);

export default Services;
