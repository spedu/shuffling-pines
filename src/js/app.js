var app = angular.module('shuffling', []);

app.value('pickupStatus', 'pickup');

app.service('GuestService', [function() {
  var svc = this;

  svc.guests = angular.fromJson(localStorage.getItem('guests')) || [];

  svc.removeGuest = function(guest) {
    guest.removed = true;
    svc.saveGuests();
  };

  svc.processGuest = function(name, transitionDate, status, pickupLocation) {
    var guest = {
      name: name,
      transitionDate: transitionDate,
      status: status,
      pickupLocation: pickupLocation
    };
    svc.guests.push(guest);
    svc.saveGuests();
    console.log(svc.guests);
  };

  svc.saveGuests = function() {
    localStorage.setItem('guests', angular.toJson(svc.guests));
  };
}]);

app.controller('GuestFormController', ['pickupStatus', 'GuestService', function(pickupStatus, guestService) {
  var vm = this;

  vm.status = pickupStatus;

  vm.processGuest = function() {
    guestService.processGuest(vm.name, vm.transitionDate, vm.status, vm.pickupLocation);
    vm.resetForm();
  };

  vm.resetForm = function() {
    vm.name = '';
    vm.transitionDate = '';
    vm.status = pickupStatus;
    vm.pickupLocation = '';
  };

  vm.clearPickupLocation = function() {
    vm.pickupLocation = '';
  };

  vm.isPickup = function() {
    return vm.status === pickupStatus;
  };
}]);

app.controller('GuestListController', ['GuestService', function(guestService) {
  var vm = this;

  vm.guests = guestService.guests;

  vm.removeGuest = function(guest) {
    if(confirm('Are you sure you want to remove: ' + guest.name)) {
      guestService.removeGuest(guest);
    }
  };
}]);

