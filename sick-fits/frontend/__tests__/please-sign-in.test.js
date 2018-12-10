import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

import PleaseSignIn from '../components/please-sign-in';
import { fakeUser } from '../lib/testUtils';
import { CURRENT_USER_QUERY } from '../resolvers/query';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: { me: null },
    },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: { me: fakeUser() },
    },
  },
];

describe('<PleaseSignIn />', () => {
  it('renders with renders the sign in dialog to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Please sign in before continuing');
    expect(wrapper.find('Signin').exists()).toBe(true);
  });
  it('renders the child component when the user is signed in', async () => {
    const Child = () => <p>I&apos;m a child component!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Child />
        </PleaseSignIn>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.contains(<Child />)).toBe(true);
  });
});
