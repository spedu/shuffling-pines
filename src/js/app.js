var app = angular.module('shuffling', []);

app.controller('GuestFormController', [function() {
  this.status = 'pickup';

  this.clearPickupLocation = function() {
    this.pickupLocation = '';
  };

  this.isPickup = function() {
    return this.status === 'pickup';
  };
}]);

/*
app.controller('GuestListController', [function() {

}]);
*/
