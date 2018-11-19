import React from 'react';

import UpdateItem from '../components/update-item';

const Update = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

export default Update;
