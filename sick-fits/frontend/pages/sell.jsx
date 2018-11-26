import React from 'react';

import CreateItem from '../components/create-item';
import PleaseSignIn from '../components/please-sign-in';

const Sell = () => (
  <div>
    <PleaseSignIn>
      <CreateItem />
    </PleaseSignIn>
  </div>
);

export default Sell;
