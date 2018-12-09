function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

// eslint-disable-next-line func-names
Person.prototype.fetchFavFoods = function () {
  return new Promise((res) => {
    setTimeout(() => res(this.foods), 2000);
  });
};

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn();
    fetchDogs('snickers');
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith('snickers');
    fetchDogs('hugo');
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });
  it('can create a person', () => {
    const me = new Person('Wes', ['pizza', 'burgers']);
    expect(me.name).toEqual('Wes');
  });
  it('can fetch foods', async () => {
    const me = new Person('Wes', ['pizza', 'burgers']);
    // mock the favFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['pizza', 'burgers']);
    const favFoods = await me.fetchFavFoods();
    expect(favFoods).toContain('pizza');
  });
});
