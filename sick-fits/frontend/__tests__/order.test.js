import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import Order from '../components/order';
import { fakeOrder } from '../lib/testUtils';
import { SINGLE_ORDER_QUERY } from '../resolvers/query';


const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: 'ord123' } },
    result: {
      data: {
        order: {
          ...fakeOrder(),
        },
      },
    },
  },
];

describe('<Order />', () => {
  it('renders the order and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="ord123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('div[data-test="order"]'))).toMatchSnapshot();
  });
});
