import * as React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import { ProtectedRoute, LoginRoute } from '../utils/auth-routes';
import Header from '../molecules/header';
import Footer from '../molecules/footer';
import Landing from '../pages/landing';
import NotFound from '../pages/not-found';
import Login from '../pages/login';
import Profile from '../pages/profile';

const App = styled.div`
  background: ${({ theme }) => theme.pages.all.background};
  color: ${({ theme }) => theme.pages.all.fontColor};
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
  padding-top: ${({ theme }) => theme.pages.all.verticalPadding};
  padding-bottom: ${({ theme }) => theme.pages.all.verticalPadding};
  padding-left: ${({ theme }) => theme.pages.all.horizontalPadding};
  padding-right: ${({ theme }) => theme.pages.all.horizontalPadding};
  width: 100%;
  max-width: ${({ theme }) => theme.pages.all.maxWidth};
  margin: 0 auto;
`;

const Pages = () => (
  <App>
    <Header />
    <Content>
      <Switch>
        <LoginRoute path="/login" exact component={Login} />
        <Route path="/" exact component={Landing} />
        <ProtectedRoute path="/profile" exact component={Profile} />
        <Route
          render={({ staticContext }) => {
            const context = staticContext as any;
            if (context) {
              context.status = 404;
            }
            return <NotFound/>;
          }}
        />
      </Switch>
    </Content>
    <Footer />
  </App>
);

export default Pages;
