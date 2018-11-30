import React from 'react';
import { Mutation, Query } from 'react-apollo';

import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import { TOGGLE_CART_MUTATION } from '../resolvers/mutation';
import { LOCAL_STATE_QUERY } from '../resolvers/query';
import CartItem from './cart-item';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';
import User from './user';

const Cart = () => (
  <User>
    {({ data: { me } }) => {
      if (!me) return null;
      return (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {toggleCart => (
            <Query query={LOCAL_STATE_QUERY}>
              {({ data }) => (
                <CartStyles open={data.cartOpen}>
                  <header>
                    <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                    <Supreme>{`${me.name.split(' ')[0]}'s Cart`}</Supreme>
                    <p>You have {me.cart.length} item{me.cart.length > 1 ? 's' : ''} in your cart.</p>
                  </header>
                  <ul>
                    {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)}
                  </ul>
                  <footer>
                    <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )
              }
            </Query>
          )}
        </Mutation>
      );
    }}
  </User>
);

export default Cart;
