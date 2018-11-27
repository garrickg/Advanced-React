import React from 'react';
import { Mutation } from 'react-apollo';

import { ADD_TO_CART_MUTATION } from '../resolvers/mutation';


const AddToCart = (props) => {
  const { id } = props;
  return (
    <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
      {addToCart => (
        <button type="button" onClick={addToCart}>Add To Cart</button>
      )}
    </Mutation>
  );
};

export default AddToCart;
