describe('pickupStatus', function() {
  var pickupStatus;
  beforeEach(module('shuffling'));
  beforeEach(inject(function($injector) {
    pickupStatus = $injector.get('pickupStatus');
  }));

  it('should be "pickup"', function() {
    expect(pickupStatus).toBe('pickup');
  });
});