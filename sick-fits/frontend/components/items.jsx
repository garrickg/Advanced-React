import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';

import { perPage } from '../config';
import { ALL_ITEMS_QUERY } from '../resolvers/query';
import Item from './item';
import Pagination from './pagination';

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

const Items = ({ page }) => (
  <Center>
    <Pagination page={parseFloat(page)} />
    <Query
      query={ALL_ITEMS_QUERY}
      variables={{
        skip: (page - 1) * perPage,
      }}
    >
      {({ data, error, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error.message}</p>;
        return (
          <ItemsList>
            {data.items.map(item => <Item item={item} key={item.id} />)}
          </ItemsList>
        );
      }}
    </Query>
    <Pagination page={parseFloat(page)} />
  </Center>
);

export default Items;
