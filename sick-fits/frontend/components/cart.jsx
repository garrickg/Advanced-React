import React from 'react';
import { Mutation, Query } from 'react-apollo';

import { TOGGLE_CART_MUTATION } from '../resolvers/mutation';
import { LOCAL_STATE_QUERY } from '../resolvers/query';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';

const Cart = () => (
  <Mutation mutation={TOGGLE_CART_MUTATION}>
    {toggleCart => (
      <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
          <CartStyles open={data.cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
              <Supreme>Your Cart</Supreme>
              <p>You have __ items in your cart.</p>
            </header>
            <footer>
              <p>$10.10</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        )
        }
      </Query>
    )}
  </Mutation>
);

export default Cart;
