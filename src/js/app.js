var app = angular.module('shuffling', []);

app.value('Guests', [{
    name: 'Guest 1',
    transitionDate: '2015-10-26T04:00:00Z',
    status: 'pickup',
    pickupLocation: 'Boston, MA'
  },{
    name: 'Guest 2',
    transitionDate: '2014-07-10T04:00:00Z',
    status: 'dropoff',
    pickupLocation: null
}]);

app.service('GuestService', ['Guests', function(Guests) {
  var svc = this;

  svc.statusTransitions = {
    pickup: 'arrived',
    dropoff: 'arrived',
    arrived: 'pickup'
  };

  svc.guests = [];

  svc.loadGuests = function() {
    svc.guests = angular.fromJson(localStorage.getItem('guests')) || Guests;
    angular.forEach(svc.guests, function(guest) {
      guest.transitionDate = new Date(Date.parse(guest.transitionDate));
    });
  };

  svc.add = function(name, transitionDate, status, pickupLocation) {
    var guest = {
      name: name,
      transitionDate: transitionDate,
      status: status,
      pickupLocation: pickupLocation
    };

    svc.guests.push(guest);

    svc.save();

    console.log(svc.guests);
  };

  svc.updateStatus = function(guest) {
    guest.status = svc.statusTransitions[guest.status];
    svc.save();
  };

  svc.remove = function(guest) {
    guest.removed = true;
    svc.save();
  };

  svc.save = function() {
    localStorage.setItem('guests', angular.toJson(svc.guests));
  };
}]);

app.controller('GuestController', ['GuestService', function(guestService) {
  var vm = this;

  vm.guestService = guestService;
  guestService.loadGuests();

  vm.activeTab = 'form';
  vm.status = 'pickup';

  vm.setActiveTab = function(tab) {
    vm.activeTab = tab;
  };

  vm.isActiveTab = function(tab) {
    return vm.activeTab === tab;
  };

  vm.processGuest = function() {
    guestService.add(vm.name, vm.transitionDate, vm.status, vm.pickupLocation);
    vm.resetForm();
    vm.setActiveTab('guests');
  };

  vm.resetForm = function() {
    vm.name = '';
    vm.transitionDate = '';
    vm.status = 'pickup';
    vm.pickupLocation = '';
  };

  vm.clearPickupLocation = function() {
    vm.pickupLocation = '';
  };

  vm.isPickup = function() {
    return vm.status === 'pickup';
  };

  vm.isGuestStatusPickup = function(guest) {
    return guest.status === 'pickup';
  };

  vm.removeGuest = function(guest) {
    if(confirm('Are you sure you want to remove: ' + guest.name)) {
      guestService.remove(guest);
    }
  };

  vm.getStatusTransition = function(guest) {
    return guestService.statusTransitions[guest.status];
  };

  vm.updateStatus = function(guest) {
    guestService.updateStatus(guest);
  };

  vm.save = function() {
    guestService.save();
  };
}]);

