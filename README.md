Shuffling Pines Dissolution Center
====

Keeps track of guests staying at the facility. 

== Features

* Add guest to the list of guests staying at the center
* Manage the status of guests staying at the center
** "pickup" -> "arrived"
** "dropoff" -> "arrived"
** "arrived" -> "pickup"
* Remove the guest from the log
** Performs a soft delete, just does not show up on form

== How to run

Note: all commands are run from the root of the project

=== Install Packages

* `npm install`
* `bower install`

== Running

* `gulp`
** builds the project
** runs the tests
** watches for javascript, css, and html changes which tests, rebuilds, livereloads as necessary

To run the tests independently:

* `karma start`