import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

import ItemComponent from '../components/item';

const testItem = {
  id: 'ABC123',
  title: 'A Test Item',
  price: 5000,
  description: 'Just a fake item for testing',
  image: 'test.jpg',
  largeImage: 'largeTest.jpg',
};

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={testItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  // it('renders and displays properly', () => {
  //   const wrapper = shallow(<ItemComponent item={testItem} />);
  //   const PriceTag = wrapper.find('PriceTag');
  //   expect(PriceTag.children().text()).toBe('$50');
  //   expect(wrapper.find('Title a').text()).toBe(testItem.title);
  //   const img = wrapper.find('img');
  //   expect(img.props().src).toBe(testItem.image);
  //   expect(img.props().alt).toBe(testItem.title);
  // });

  // it('renders out the button properly', () => {
  //   const wrapper = shallow(<ItemComponent item={testItem} />);
  //   const ButtonList = wrapper.find('.buttonList');
  //   expect(ButtonList.children()).toHaveLength(3);
  //   expect(ButtonList.find('Link')).toHaveLength(1);
  //   expect(ButtonList.find('AddToCart')).toHaveLength(1);
  //   expect(ButtonList.find('DeleteItem')).toHaveLength(1);
  // });
});
