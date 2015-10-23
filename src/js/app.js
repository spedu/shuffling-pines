var app = angular.module('shuffling', []);

app.value('pickupStatus', 'pickup');

app.service('GuestService', [function() {
  this.processGuest = function(name, transitionDate, status, pickupLocation) {
    console.log(name + ', ' +  transitionDate + ', ' +  status + ', ' + pickupLocation);
  };

  return this;
}]);

app.controller('GuestFormController', ['pickupStatus', 'GuestService', function(pickupStatus, guestService) {
  this.status = pickupStatus;

  this.processGuest = function() {
    guestService.processGuest(this.name, this.transitionDate, this.status, this.pickupLocation);
    this.resetForm();
  };

  this.resetForm = function() {
    this.name = '';
    this.transitionDate = '';
    this.status = pickupStatus;
    this.pickupLocation = '';
  };

  this.clearPickupLocation = function() {
    this.pickupLocation = '';
  };

  this.isPickup = function() {
    return this.status === pickupStatus;
  };
}]);

/*
app.controller('GuestListController', [function() {

}]);
*/
