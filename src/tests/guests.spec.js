describe('Guests', function() {
  var guests;

  beforeEach(module('shuffling'));
  beforeEach(inject(function($injector) {
    guests = $injector.get('Guests');
  }));

  it('should be an initial set of guests', function() {
    var expected = [{
        name: 'Guest 1',
        transitionDate: '2015-10-26T04:00:00Z',
        status: 'pickup',
        pickupLocation: 'Boston, MA'
      }, {
        name: 'Guest 2',
        transitionDate: '2014-07-10T04:00:00Z',
        status: 'dropoff',
        pickupLocation: null
    }];

    expect(guests).toEqual(expected);
  });
});