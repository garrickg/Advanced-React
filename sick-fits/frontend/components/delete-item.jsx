import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import { ALL_ITEMS_QUERY } from './items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    // manually update client cache to match server
    // read cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // filter the delete item from the page
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    // put items back in cache
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  render() {
    const { id, children } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem().catch((err) => {
                  alert(err.message);
                });
              }
            }}
          >{children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
