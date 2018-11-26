import React from 'react';
import { Query } from 'react-apollo';

import Signin from './signin';
import { CURRENT_USER_QUERY } from './user';


const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (!data.me) {
        return (
          <div>
            <p>Please sign in before continuing</p>
            <Signin />
          </div>
        );
      }
      return props.children;
    }}
  </Query>
);

export default PleaseSignIn;
