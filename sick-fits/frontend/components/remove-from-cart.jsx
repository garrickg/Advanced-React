import PropTypes from 'prop-types';
import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';

import { REMOVE_FROM_CART_MUTATION } from '../resolvers/mutation';
import { CURRENT_USER_QUERY } from '../resolvers/query';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = ({ id }) => (
  <Mutation
    mutation={REMOVE_FROM_CART_MUTATION}
    variables={{ id }}
    update={(cache, payload) => {
      const data = cache.readQuery({
        query: CURRENT_USER_QUERY,
      });
      const cartItemId = payload.data.removeFromCart.id;
      data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
      cache.writeQuery({
        query: CURRENT_USER_QUERY, data,
      });
    }}
    optimisticResponse={{
      __typename: 'Mutation',
      removeFromCart: {
        __typename: 'CartItem',
        id,
      },
    }}
  >
    {(removeFromCart, { loading }) => (
      <BigButton
        title="Delete Item"
        disabled={loading}
        onClick={() => {
          removeFromCart().catch(error => alert(error.message));
        }}
      >&times;
      </BigButton>
    )}
  </Mutation>
);

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
};

export default RemoveFromCart;
