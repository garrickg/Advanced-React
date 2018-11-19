import React from 'react';

import SingleItem from '../components/single-item';

const Item = ({ query }) => (
  <div>
    <SingleItem id={query.id} />
  </div>
);

export default Item;
