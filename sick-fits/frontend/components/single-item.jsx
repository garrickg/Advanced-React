import gql from 'graphql-tag';
import Head from 'next/head';
import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';

import Error from './error-message';

const SingleItemSytles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
      price
    }
  }
`;

const SingleItem = ({ id }) => (
  <Query
    query={SINGLE_ITEM_QUERY}
    variables={{ id }}
  >
    {({ error, loading, data }) => {
      if (error) return <Error error={error} />;
      if (loading) return <p>Loading...</p>;
      if (!data.item) return <p>No Item Found for {id}</p>;
      return (
        <SingleItemSytles>
          <Head>
            <title>Sick Fits | {data.item.title}</title>
          </Head>
          <img src={data.item.largeImage} alt={data.item.title} />
          <div className="details">
            <h2>Viewing {data.item.title}</h2>
            <p>{data.item.description}</p>
          </div>
        </SingleItemSytles>
      );
    }}
  </Query>
);

export default SingleItem;
