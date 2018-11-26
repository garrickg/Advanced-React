import React from 'react';
import styled from 'styled-components';

import RequestReset from '../components/request-reset';
import Signin from '../components/signin';
import Signup from '../components/signup';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignupPage = () => (
  <Columns>
    <Signup />
    <Signin />
    <RequestReset />
  </Columns>
);

export default SignupPage;
