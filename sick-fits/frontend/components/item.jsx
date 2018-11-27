import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import formatMoney from '../lib/formatMoney';
import AddToCart from './add-to-cart';
import DeleteItem from './delete-item';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Title from './styles/Title';

const Item = ({ item }) => (
  <ItemStyles>
    {item.image && <img src={item.image} alt={item.title} />}
    <Title>
      <Link href={{
        pathname: '/item',
        query: { id: item.id },
      }}
      >
        <a>
          {item.title}
        </a>
      </Link>
    </Title>
    <PriceTag>{formatMoney(item.price)}</PriceTag>
    <p>{item.description}</p>
    <div className="buttonList">
      <Link href={{
        pathname: 'update',
        query: { id: item.id },
      }}
      >
        <a>Edit...</a>
      </Link>
      <AddToCart id={item.id} />
      <DeleteItem id={item.id}>Delete Item</DeleteItem>
    </div>
  </ItemStyles>
);

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
