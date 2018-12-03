import React from 'react';

import OrderList from '../components/order-list';
import PleaseSignIn from '../components/please-sign-in';

const Orders = ({ query: { id } }) => (
  <div>
    <PleaseSignIn>
      <OrderList />
    </PleaseSignIn>
  </div>
);

export default Orders;
