import React from 'react';
import { adopt } from 'react-adopt';
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
import TakeMyMoney from './take-my-money';
import User from './user';

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = () => (
  <Composed>
    {({ user: { data: { me } }, toggleCart, localState }) => {
      if (!me) return null;
      return (
        <CartStyles open={localState.data.cartOpen}>
          <header>
            <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
            <Supreme>{`${me.name.split(' ')[0]}'s Cart`}</Supreme>
            <p>You have {me.cart.length} item{me.cart.length > 1 ? 's' : ''} in your cart.</p>
          </header>
          <ul>
            {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)}
          </ul>
          <footer>
            {me.cart.length > 0 && (
              <>
                <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                <TakeMyMoney>
                  <SickButton>Checkout</SickButton>
                </TakeMyMoney>
              </>
            )}
          </footer>
        </CartStyles>
      );
    }}
  </Composed>
);

export default Cart;
