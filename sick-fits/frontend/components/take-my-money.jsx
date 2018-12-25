import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import StripeCheckout from 'react-stripe-checkout';

import calcTotalPrice from '../lib/calcTotalPrice';
import { CREATE_ORDER_MUTATION, TOGGLE_CART_MUTATION } from '../resolvers/mutation';
import { CURRENT_USER_QUERY } from '../resolvers/query';
import User from './user';

const totalItems = cart => cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);

const onToken = async (res, createOrder, toggleCart) => {
  NProgress.start();
  const order = await createOrder({
    variables: {
      token: res.id,
    },
  }).catch((error) => {
    alert(error.message);
  });
  toggleCart();
  Router.push({
    pathname: '/order',
    query: { id: order.data.createOrder.id },
  });
};

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  createOrder: ({ render }) => (
    <Mutation
      mutation={CREATE_ORDER_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >{render}
    </Mutation>
  ),
});

const TakeMyMoney = props => (
  <Composed>
    {({ user: { data: { me }, loading }, toggleCart, createOrder }) => {
      if (loading) return null;
      return (
        <StripeCheckout
          amount={calcTotalPrice(me.cart)}
          name="Sick Fits"
          description={`Order of ${totalItems(me.cart)} items`}
          image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
          stripeKey="pk_test_JRjVGOhlE1o13VeatEYL5vTb"
          currency="CAD"
          email={me.email}
          token={res => onToken(res, createOrder, toggleCart)}
        >
          {props.children}
        </StripeCheckout>
      );
    }
    }
  </Composed>
);

export default TakeMyMoney;
export { onToken };
