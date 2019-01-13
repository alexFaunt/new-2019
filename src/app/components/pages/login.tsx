import * as React from 'react';
import styled from 'styled-components';

import LoginForm from '../molecules/login-form';

const Form = styled(LoginForm)`
  margin: 100px auto 0;
`;

const LoginPage = () => <Form />;

export default LoginPage;
