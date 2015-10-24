var app = angular.module('shuffling', []);

app.value('pickupStatus', 'pickup');

app.service('GuestService', [function() {
  var svc = this;

  svc.guests = angular.fromJson(localStorage.getItem('guests')) || [];

  svc.processGuest = function(name, transitionDate, status, pickupLocation) {
    var guest = {
      name: name,
      transitionDate: transitionDate,
      status: status,
      pickupLocation: pickupLocation
    };
    
    svc.guests.push(guest);

    localStorage.setItem('guests', angular.toJson(svc.guests));

    console.log(svc.guests);
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

app.controller('GuestListController', ['$scope', 'GuestService', function($scope, guestService) {
  var vm = this;

  vm.guests = guestService.guests;
}]);

