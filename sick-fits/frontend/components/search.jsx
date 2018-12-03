import Downshift, { resetIdCounter } from 'downshift';
import debounce from 'lodash.debounce';
import Router from 'next/router';
import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';

import { SEARCH_ITEMS_QUERY } from '../resolvers/query';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const routeToItem = (item) => {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
};

class AutoComplete extends Component {
  state = {
    items: [],
    loading: false,
  }

  onChange = debounce(async (e, client) => {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: {
        searchTerm: e.target.value,
      },
    });
    this.setState({
      items: res.data.items,
      loading: false,
    });
  }, 350);

  render() {
    const { items, loading } = this.state;
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          itemToString={item => (item === null ? '' : item.title)}
          onChange={routeToItem}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
                <ApolloConsumer>
                  {client => (
                    <input
                      {...getInputProps({
                        type: 'search',
                        placeholder: 'Search for an item',
                        id: 'search',
                        className: loading ? 'loading' : '',
                        onChange: (e) => {
                          e.persist();
                          this.onChange(e, client);
                        },
                      })}
                    />
                  )}
                </ApolloConsumer>
                {isOpen && (
                  <DropDown>
                    {items.map((item, index) => (
                      <DropDownItem
                        {...getItemProps({ item })}
                        key={item.id}
                        highlighted={index === highlightedIndex}
                      >
                        <img src={item.image} alt={item.title} width="50" />
                        {item.title}
                      </DropDownItem>
                    ))}
                    {!items.length && !loading && (
                      <DropDownItem>
                        No results for {inputValue}
                      </DropDownItem>
                    )}
                  </DropDown>
                )}
              </div>
          )}
        </Downshift>
      </SearchStyles>

    );
  }
}

export default AutoComplete;
