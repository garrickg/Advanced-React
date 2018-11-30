import React from 'react';
import { Mutation } from 'react-apollo';

import { ADD_TO_CART_MUTATION } from '../resolvers/mutation';
import { CURRENT_USER_QUERY } from '../resolvers/query';


const AddToCart = (props) => {
  const { id } = props;
  return (
    <Mutation
      mutation={ADD_TO_CART_MUTATION}
      variables={{ id }}
      refetchQueries={[{
        query: CURRENT_USER_QUERY,
      }]}
    >
      {(addToCart, { loading }) => (
        <button type="button" onClick={addToCart} disabled={loading}>Add{loading ? 'ing' : ''} To Cart</button>
      )}
    </Mutation>
  );
};

export default AddToCart;
