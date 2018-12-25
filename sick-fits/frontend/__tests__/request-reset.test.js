import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import RequestReset from '../components/request-reset';
import { REQUEST_RESET_MUTATION } from '../resolvers/mutation';


const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'garrickgunn@gmail.com' },
    },
    result: {
      data: { requestReset: { message: 'success', __typename: 'Message' } },
    },
  },
];

describe('<RequestReset/>', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });
  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // simulate typing in email
    wrapper.find('input').simulate('change', {
      target: {
        name: 'email', value: 'garrickgunn@gmail.com',
      },
    });
    // submit the form
    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();
    expect(wrapper.find('p').text()).toContain('Success! Check your email for a reset link!');
  });
});
