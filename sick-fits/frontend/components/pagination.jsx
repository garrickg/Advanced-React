import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';

import { perPage } from '../config';
import PaginationStyles from './styles/PaginationStyles';


const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ error, loading, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error!</p>;
      const { count } = data.itemsConnection.aggregate;
      const pages = Math.ceil(count / perPage);
      const { page } = props;
      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits | Page {page} of {pages}</title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>{'<- Prev'}</a>
          </Link>
          <p>Page {page} of {pages}</p>
          <p>{count} items total</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>{'Next ->'}</a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
