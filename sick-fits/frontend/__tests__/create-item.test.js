import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import CreateItem from '../components/create-item';
import { CREATE_ITEM_MUTATION } from '../resolvers/mutation';
import { fakeItem } from '../lib/testUtils';

const image = 'https://dog.com/dog.jpg';
// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: image,
    eager: [{ secure_url: image }],
  }),
});

describe('<CreateItem/>', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });
  it('uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const input = wrapper.find('input[type="file"]');
    input.simulate('change', { target: { files: ['fakeImage.jpg'] } });
    await wait();
    const component = wrapper.find('CreateItem').instance();
    expect(component.state.image).toEqual(image);
    expect(component.state.largeImage).toEqual(image);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });
  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    wrapper.find('input#title').simulate('change', { target: { value: 'Test Title', name: 'title' } });
    wrapper.find('textarea#description').simulate('change', { target: { value: 'Test Description', name: 'description' } });
    wrapper.find('input#price').simulate('change', { target: { value: 50000, name: 'price', type: 'number' } });
    await wait();
    const component = wrapper.find('CreateItem').instance();
    expect(component.state).toMatchObject({
      title: 'Test Title',
      description: 'Test Description',
      price: 50000,
    });
  });
  it('creates an item when the form is submitted', async () => {
    const item = fakeItem();
    const mocks = [{
      request: {
        query: CREATE_ITEM_MUTATION,
        variables: {
          title: item.title,
          description: item.description,
          image: '',
          largeImage: '',
          price: item.price,
        },
      },
      result: {
        data: {
          createItem: {
            ...item,
            id: 'abc123',
            __typename: 'Item',
          },
        },
      },
    }];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
    // simulate filling out form
    wrapper.find('input#title').simulate('change', { target: { value: item.title, name: 'title' } });
    wrapper.find('textarea#description').simulate('change', { target: { value: item.description, name: 'description' } });
    wrapper.find('input#price').simulate('change', { target: { value: item.price, name: 'price', type: 'number' } });
    // mock the router
    Router.router = { push: jest.fn() };
    wrapper.find('form[data-test="form"]').simulate('submit');
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({ pathname: '/item', query: { id: 'abc123' } });
  });
});
