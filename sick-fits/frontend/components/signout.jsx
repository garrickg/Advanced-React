import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';

import { CURRENT_USER_QUERY } from './user';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = () => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[
      { query: CURRENT_USER_QUERY },
    ]}
  >
    {signout => (
      <button type="button" onClick={signout}>Sign Out</button>
    )
    }
  </Mutation>
);

export default Signout;
