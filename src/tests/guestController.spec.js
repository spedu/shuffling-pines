describe('GuestController', function() {
  var pickupStatus = 'pickup';

  var guestController;

  beforeEach(module('shuffling'));

  beforeEach(function() {
    module(function($provide) {
      //$provide.value('initialGuests', []);
      $provide.value('pickupStatus', pickupStatus);
      $provide.service('GuestService', function() {
        this.guests = [];
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
      });
    });

    inject(function($controller) {
      guestController = $controller('GuestController');
    });
  });

  describe('initialization', function() {
    it('should set pickupStatus to the value injected in', function() {
      expect(guestController.status).toBe(pickupStatus); 
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
      expect(guestController.status).toBe(pickupStatus);
      expect(guestController.pickupLocation).toBe('');
    });
  });

  describe('processGuest', function() {

  });

  describe('removeGuest', function() {

  });
});