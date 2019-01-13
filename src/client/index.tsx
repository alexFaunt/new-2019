import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

import ScrollToTop from './scroll-to-top';
import App from "../app"; // TODO absolute paths on app
import createClient from '../app/apollo';

const initialState = (window as any).__APOLLO_STATE__;

const client = createClient(initialState);

const Wrapper = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.render(<Wrapper />, document.getElementById("app"));
