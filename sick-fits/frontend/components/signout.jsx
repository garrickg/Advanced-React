import React from 'react';
import { Mutation } from 'react-apollo';

import { SIGN_OUT_MUTATION } from '../resolvers/mutation';
import { CURRENT_USER_QUERY } from '../resolvers/query';

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
