import React from 'react';

import Order from '../components/order';
import PleaseSignIn from '../components/please-sign-in';

const OrderPage = ({ query: { id } }) => (
  <div>
    <PleaseSignIn>
      <Order id={id} />
    </PleaseSignIn>
  </div>
);

export default OrderPage;
