describe('GuestController', function() {
  var guestController;

  beforeEach(module('shuffling'));
  beforeEach(function() {
    module(function($provide) {
      $provide.service('GuestService', function() {
        var svc = this;
        this.guests = [];
        this.statusTransitions = {
          pickup: 'something',
          something: 'pickup'
        };
        this.loadGuests = function() {
          // no-op
        };
        this.add = function(name, transitionDate, status, pickupLocation) {
          var guest = {
            name: name,
            transitionDate: transitionDate, 
            status: status,
            pickupLocation: pickupLocation
          };
          this.guests.push(guest);
        };
        this.remove = function(guest) {
          guest.removed = true;
        };
        this.updateStatus = function(guest) {
          guest.status = svc.statusTransitions[guest.status];
        };
        this.save = function() {
          // no-op
        };
      });
    });

    inject(function($controller) {
      guestController = $controller('GuestController');
    });
  });

  describe('initialization', function() {
    it('should set pickupStatus to the value injected in', function() {
      expect(guestController.status).toBe('pickup'); 
    });

    it('should set activeTab to "form"', function() {
      expect(guestController.activeTab).toBe('form');
    });
  });

  describe('setActiveTab', function() {
    it('should set the name of the active tab', function() {
      var expected = 'someTab';
      guestController.setActiveTab(expected);
      expect(guestController.activeTab).toBe(expected);
    });
  });

  describe('isActiveTab', function() {
    it('should return true when the active tab equals the tab name', function() {
      guestController.setActiveTab('guests');
      expect(guestController.isActiveTab('guests')).toBeTruthy();
    });

    it('should return false when the active tab is different from the tab name', function() {
      guestController.setActiveTab('test');
      expect(guestController.isActiveTab('guests')).toBeFalsy();
    });
  });

  describe('isPickup', function() {
    it('should return true when the status is "pickup"', function() {
      guestController.status = 'pickup';
      expect(guestController.isPickup()).toBeTruthy();
    });

    it('should return false when the status is something other than "pickup"', function() {
      guestController.status = 'dropoff';
      expect(guestController.isPickup()).toBeFalsy();
    });
  });

  describe('getStatusTransition', function() {
    it('should return what the next status of the guest', function() {
      var guest = {
        name: 'John Harvard',
        status: 'pickup'
      };

      expect(guestController.getStatusTransition(guest)).toBe('something');
    });
  });

  describe('clearPickupLocation', function() {
    it('should set the pickup location to an empty string', function() {
      guestController.pickupLocation = 'Boston, MA';
      guestController.clearPickupLocation();
      expect(guestController.pickupLocation).toBe('');
    });
  });

  describe('resetForm', function() {
    it('should reset all of the form values back to their defaults', function() {
      guestController.name = 'John Harvard';
      guestController.transitionDate = '2015/10/20';
      guestController.status = 'dropoff';
      guestController.pickupLocation = 'Somewhere';

      guestController.resetForm();

      expect(guestController.name).toBe('');
      expect(guestController.transitionDate).toBe('');
      expect(guestController.status).toBe('pickup');
      expect(guestController.pickupLocation).toBe('');
    });
  });

  describe('processGuest', function() {
    it('should add the guest to the guest list', function() {
      var name = 'John Harvard',
          transitionDate = '2015-10-28T04:00:00.000Z',
          status = 'pickup',
          pickupLocation = 'Boston, MA';

      guestController.name = name;
      guestController.transitionDate = transitionDate;
      guestController.status = status;
      guestController.pickupLocation = pickupLocation;

      expect(guestController.guestService.guests.length).toBe(0);

      spyOn(guestController.guestService, 'add').and.callThrough();

      guestController.processGuest();

      expect(guestController.guestService.add).toHaveBeenCalledWith(name, transitionDate, status, pickupLocation);
      expect(guestController.guestService.guests.length).toBe(1);
    });

    it('should reset the form', function() {
      guestController.name = 'John Harvard';
      guestController.transitionDate = '2015-10-28T04:00:00.000Z';
      guestController.status = 'pickup';
      guestController.pickupLocation = 'Boston, MA';

      guestController.processGuest();

      expect(guestController.name).toBe('');
      expect(guestController.transitionDate).toBe('');
      expect(guestController.status).toBe('pickup');
      expect(guestController.pickupLocation).toBe('');
    });

    it('should transition to the guest list tab', function() {
      guestController.name = 'John Harvard';
      guestController.transitionDate = '2015-10-28T04:00:00.000Z';
      guestController.status = 'pickup';
      guestController.pickupLocation = 'Boston, MA';

      guestController.processGuest();

      expect(guestController.activeTab).toBe('guests');
    });
  });

  describe('removeGuest', function() {
    describe('when confirm is cancelled', function() {
      it('should not "remove" the guest', function() {
        var guest = {
          name: 'John Harvard'
        };

        spyOn(window, 'confirm').and.returnValue(false);
        spyOn(guestController.guestService, 'remove').and.callThrough();

        guestController.removeGuest(guest);

        expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove: ' + guest.name);
        expect(guestController.guestService.remove).not.toHaveBeenCalled();
        expect(guest.removed).toBeUndefined();
      });
    });

    describe('when confirm is cancelled', function() {
      it('should not "remove" the guest', function() {
        var guest = {
          name: 'John Harvard'
        };

        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(guestController.guestService, 'remove').and.callThrough();

        guestController.removeGuest(guest);

        expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove: ' + guest.name);
        expect(guestController.guestService.remove).toHaveBeenCalledWith(guest);
        expect(guest.removed).toBeTruthy();
      });
    });
  });

  describe('updateStatus', function() {
    it('should transition the status of the guest', function() {
      var guest = {name: 'John Harvard', status: 'pickup'};
   
      spyOn(guestController.guestService, 'updateStatus').and.callThrough();

      guestController.updateStatus(guest);

      expect(guestController.guestService.updateStatus).toHaveBeenCalledWith(guest);
      expect(guest.status).toBe('something');
    });
  });

  describe('save', function() {
    it('should save the current state of the guest list', function() {
      spyOn(guestController.guestService, 'save').and.callThrough();

      guestController.save();

      expect(guestController.guestService.save).toHaveBeenCalledWith();
    });
  });

  describe('isGuestStatusPickup', function() {
    it('should return true when the status of the guest is "pickup"', function() {
      var guest = {
        status: 'pickup'
      };
      expect(guestController.isGuestStatusPickup(guest)).toBeTruthy();
    });

    it('should return false when the status of the guest is something other than "pickup"', function() {
      var guest = {
        status: 'dropoff'
      };
      expect(guestController.isGuestStatusPickup(guest)).toBeFalsy();
    });
  });
});