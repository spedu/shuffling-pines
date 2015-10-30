describe('GuestService', function() {
  var guestList = [{name: 'Guest 1', transitionDate: '2015-10-26T04:00:00.000Z', status: 'pickup', pickupLocation: 'Boston, MA'}];

  var guestService;

  beforeEach(module('shuffling'));

  beforeEach(function() {
    module(function($provide) {
      $provide.value('Guests', guestList);
    });

    inject(function($injector) {
      guestService = $injector.get('GuestService');
    });

    var store = {};
    spyOn(localStorage, 'getItem').and.callFake(function(key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function(key, value) {
      store[key] = value + '';
    });
    spyOn(localStorage, 'clear').and.callFake(function() { store = {}; });
    localStorage.clear(); // FF fix
  });

  describe('#loadGuests', function() {
    describe('when there are no guests in localStorage', function() {
      it('should initialize the guest list to the injected value', function() {
        guestService.loadGuests();
        expect(guestService.guests).toBe(guestList);
      });
    });
    
    describe('when there are guests stored in localStorage', function() {
      it('should populate guests with the guests in localStorage', function() {
        var expectedValue = [{name:"John Harvard", transitionDate: new Date(Date.parse('2015-10-10T04:00:00.000Z'))}];
        localStorage.setItem('guests', JSON.stringify(expectedValue));

        guestService.loadGuests();
        expect(guestService.guests).toEqual(expectedValue);
      });
    });
  });
  
  describe('#save', function() {
    it('should persist the guest list to localStorage', function() {
      var guests = [{name: 'John Harvard'}];

      expect(localStorage.getItem('guests')).toBeUndefined();

      guestService.guests = guests;
      guestService.save();
      
      expect(localStorage.setItem).toHaveBeenCalled();
      expect(localStorage.getItem('guests')).toBe(JSON.stringify(guests));
    });
  });

  describe('#add', function() {
    it('should add an entry to the guest list', function() {
      expect(guestService.guests.length).toBe(0);
      guestService.add('Guest 2', new Date(Date.parse('2015-10-10T04:00:00.000Z')), 'pickup', 'Cambridge, MA');
      expect(guestService.guests.length).toBe(1);
      expect(guestService.guests[0]).toEqual({name: 'Guest 2', transitionDate: new Date(Date.parse('2015-10-10T04:00:00.000Z')), status: 'pickup', pickupLocation: 'Cambridge, MA'});
    });

    it('should persist the guest list to localStorage', function() {
      spyOn(guestService, 'save').and.callThrough();
      guestService.add('Guest 2', new Date(Date.parse('2015-10-10T04:00:00.000Z')), 'pickup', 'Cambridge, MA');
      expect(guestService.save).toHaveBeenCalled();
      expect(guestService.guests.length).toBe(1);
      expect(localStorage.getItem('guests')).toBe(JSON.stringify(guestService.guests));
    });

    it('should log the guest list to console', function() {
      spyOn(console, 'log');
      guestService.add('Guest 2', new Date(Date.parse('2015-10-10T04:00:00.000Z')), 'pickup', 'Cambridge, MA');
      expect(guestService.guests.length).toBe(1);
      expect(console.log).toHaveBeenCalledWith(guestService.guests);
    });
  });

  describe('#remove', function() {
    it('should mark the guest as removed (soft-delete)', function() {
      guestService.add('Guest 2', '2015-10-10T04:00:00Z', 'pickup', 'Cambridge, MA');

      var guest = guestService.guests[0];

      expect(guestService.guests.length).toBe(1);

      guestService.remove(guest);

      console.log(guestService.guests);

      expect(guestService.guests.length).toBe(1);
      expect(guestService.guests[0].removed).toBeDefined();
      expect(guestService.guests[0].removed).toBe(true);
    });
  });

  describe('#updateStatus', function() {
    describe('when the guest status is "pickup"', function() {
      beforeEach(function() {
        guestService.add('John Harvard', '2015-10-26T04:00:00.000Z', 'pickup', 'Somewhere USA');
      });

      it('should transition the status to "arrived"', function() {
        var guest = guestService.guests[0];
        guestService.updateStatus(guest);
        expect(guest.status).toBe('arrived');
      });

      it('should call save on the current state of the guest list', function() {
        spyOn(guestService, 'save').and.callThrough();
        var guest = guestService.guests[0];
        guestService.updateStatus(guest);
        expect(guestService.save).toHaveBeenCalled();
      });
    });

    describe('when the guest status is "dropoff"', function() {
      beforeEach(function() {
        guestService.add('John Harvard', '2015-10-26T04:00:00.000Z', 'dropoff', null);
      });

      it('should transition the status to "arrived"', function() {
        var guest = guestService.guests[0];
        guestService.updateStatus(guest);
        expect(guest.status).toBe('arrived');
      });

      it('should call save on the current state of the guest list', function() {
        spyOn(guestService, 'save').and.callThrough();
        var guest = guestService.guests[0];
        guestService.updateStatus(guest);
        expect(guestService.save).toHaveBeenCalled();
      });
    });

    describe('when the guest status is "arrived"', function() {
      beforeEach(function() {
        guestService.add('John Harvard', '2015-10-26T04:00:00.000Z', 'arrived', 'Somewhere USA');
      });

      it('should transition the status to "pickup"', function() {
        var guest = guestService.guests[0];
        guestService.updateStatus(guest);
        expect(guest.status).toBe('pickup');
      });

      it('should call save on the current state of the guest list', function() {
        spyOn(guestService, 'save').and.callThrough();
        var guest = guestService.guests[0];
        guestService.updateStatus(guest);
        expect(guestService.save).toHaveBeenCalled();
      });
    });
  });
});