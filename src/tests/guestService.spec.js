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
      expect(guestService.guests.length).toBe(1);
      guestService.add('Guest 2', '2015-10-10T04:00:00Z', 'pickup', 'Cambridge, MA');
      expect(guestService.guests.length).toBe(2);
      expect(guestService.guests[1]).toEqual({name: 'Guest 2', transitionDate: '2015-10-10T04:00:00Z', status: 'pickup', pickupLocation: 'Cambridge, MA'});
    });

    it('should persist the guest list to localStorage', function() {
      spyOn(guestService, 'save').and.callThrough();
      guestService.add('Guest 2', '2015-10-10T04:00:00Z', 'pickup', 'Cambridge, MA');
      expect(guestService.save).toHaveBeenCalled();
      expect(guestService.guests.length).toBe(2);
      expect(localStorage.getItem('guests')).toBe(JSON.stringify(guestService.guests));
    });

    it('should log the guest list to console', function() {
      spyOn(console, 'log');
      guestService.add('Guest 2', '2015-10-10T04:00:00Z', 'pickup', 'Cambridge, MA');
      expect(guestService.guests.length).toBe(2);
      expect(console.log).toHaveBeenCalledWith(guestService.guests);
    });

    describe('when add is given a date object as the transitionDate', function() {
      it('should JSONify the transitionDate', function() {
        expect(guestService.guests.length).toBe(1);

        var transitionDate = new Date(2015, 10, 12);
        var expectedTransitionDate = transitionDate.toJSON();

        guestService.add('Guest 2', transitionDate, 'dropoff', null);
        expect(guestService.guests.length).toBe(2);
        expect(guestService.guests[1]).toEqual({name: 'Guest 2', transitionDate: expectedTransitionDate, status: 'dropoff', pickupLocation: null});
      });
    });
  });

  describe('#remove', function() {
    it('should mark the guest as removed (soft-delete)', function() {
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
        var guest = guestService.guests.slice(-1)[0];
        guestService.updateStatus(guest);
        expect(guest.status).toBe('arrived');
      });

      it('should call save on the current state of the guest list', function() {
        spyOn(guestService, 'save').and.callThrough();
        var guest = guestService.guests.slice(-1)[0];
        guestService.updateStatus(guest);
        expect(guestService.save).toHaveBeenCalled();
      });
    });

    describe('when the guest status is "dropoff"', function() {
      beforeEach(function() {
        guestService.add('John Harvard', '2015-10-26T04:00:00.000Z', 'dropoff', null);
      });

      it('should transition the status to "arrived"', function() {
        var guest = guestService.guests.slice(-1)[0];
        guestService.updateStatus(guest);
        expect(guest.status).toBe('arrived');
      });

      it('should call save on the current state of the guest list', function() {
        spyOn(guestService, 'save').and.callThrough();
        var guest = guestService.guests.slice(-1)[0];
        guestService.updateStatus(guest);
        expect(guestService.save).toHaveBeenCalled();
      });
    });

    describe('when the guest status is "arrived"', function() {
      beforeEach(function() {
        guestService.add('John Harvard', '2015-10-26T04:00:00.000Z', 'arrived', 'Somewhere USA');
      });

      it('should transition the status to "pickup"', function() {
        var guest = guestService.guests.slice(-1)[0];
        guestService.updateStatus(guest);
        expect(guest.status).toBe('pickup');
      });

      it('should call save on the current state of the guest list', function() {
        spyOn(guestService, 'save').and.callThrough();
        var guest = guestService.guests.slice(-1)[0];
        guestService.updateStatus(guest);
        expect(guestService.save).toHaveBeenCalled();
      });
    });
  });
});