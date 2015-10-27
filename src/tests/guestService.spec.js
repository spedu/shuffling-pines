describe('GuestService', function() {
  var guestList = [{name: 'Guest 1', transitionDate: '2015-10-26T04:00:00Z', status: 'pickup', pickupLocation: 'Boston, MA'}];

  var guestService;

  beforeEach(module('shuffling'));

  beforeEach(function() {
    module(function($provide) {
      $provide.value('initialGuests', guestList);
    });

    inject(function($injector) {
      guestService = $injector.get('GuestService');
    });

    var store = {};
    spyOn(localStorage, 'getItem').and.callFake(function(key) {
      return store[key] || '[]';
    });
    spyOn(localStorage, 'setItem').and.callFake(function(key, value) {
      store[key] = value + '';
    });
    spyOn(localStorage, 'clear').and.callFake(function() { store = {}; });
    localStorage.clear(); // FF fix
  });

  it('should initialize the guest list to the injected value', function() {
    expect(guestService.guests).toBe(guestList);
  });

  describe('#save', function() {
    it('should persist the guest list to localStorage', function() {
      expect(localStorage.getItem('guests')).toBe('[]');
      guestService.save();
      expect(localStorage.getItem('guests')).toBe(JSON.stringify(guestList));
    });
  });

  describe('#add', function() {
    it('should add an entry to the guest list', function() {
      
    });
  });

  describe('#remove', function() {

  });

});