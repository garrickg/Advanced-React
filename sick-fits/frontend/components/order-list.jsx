import { formatDistance } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';

import formatMoney from '../lib/formatMoney';
import { USER_ORDERS_QUERY } from '../resolvers/query';
import Error from './error-message';
import OrderItemStyles from './styles/OrderItemStyles';

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = () => (
  <Query query={USER_ORDERS_QUERY}>
    {({ data: { orders }, error, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <Error error={error} />;
      return (
        <div>
          <h2>You have {orders.length} orders</h2>
          <OrderUl>
            {orders.map(order => (
              <OrderItemStyles key={order.id}>
                <Link href={{
                  pathname: '/order',
                  query: { id: order.id },
                }}
                >
                  <a>
                    <div className="order-meta">
                      <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Item{order.items.reduce((a, b) => a + b.quantity, 0) !== 1 ? 's' : ''}</p>
                      <p>{order.items.length} Product{order.items.length !== 1 ? 's' : ''}</p>
                      <p>{formatDistance(order.createdAt, new Date())} ago</p>
                      <p>{formatMoney(order.total)}</p>
                    </div>
                    <div className="images">
                      {order.items.map(item => (
                        <img src={item.image} alt={item.title} key={item.id} />
                      ))}
                    </div>
                  </a>
                </Link>
              </OrderItemStyles>
            ))}
          </OrderUl>
        </div>
      );
    }}
  </Query>
);

export default OrderList;
