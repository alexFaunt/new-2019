import * as React from 'react';
import styled from 'styled-components';

import useAuthState from '../../../state/auth';
import { Link } from 'react-router-dom';

const Wrapper = styled.header`
  position: relative;
`;

// was typography
const Title = styled.h4`
  text-align: center;
`;

const Logout = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
`;

const Header = () => {
  const { actions: { clear } } = useAuthState();
  return (
    <Wrapper>
      <Title>Title</Title>
      <Logout type="button" onClick={clear}>Log out</Logout>
      <Link to="/profile">Profile</Link>
    </Wrapper>
  );
};

export default Header;
