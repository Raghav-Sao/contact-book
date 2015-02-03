var myApp = angular.module('myapplication', ['ngRoute', 'ngResource']); 

//Factory
myApp.factory('Contacts', ['$resource',function($resource){
  return $resource('/contacts.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('Contact', ['$resource', function($resource){
  return $resource('/contacts/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);

//Controller
myApp.controller("ContactListCtr", ['$scope', '$http', '$resource', 'Contacts', 'Contact', '$location', function($scope, $http, $resource, Contacts, Contact, $location) {

  $scope.contacts = Contacts.query();

  $scope.deleteContact = function (contactId) {
    if (confirm("Are you sure you want to delete this contact?")){
      Contact.delete({ id: contactId }, function(){
        $scope.contacts = Contacts.query();
        $location.path('/');
      });
    }
  };
}]);

myApp.controller("ContactUpdateCtr", ['$scope', '$resource', 'Contact', '$location', '$routeParams', function($scope, $resource, Contact, $location, $routeParams) {
  $scope.contact = Contact.get({id: $routeParams.id})
  $scope.phone = /\d{10,15}/;
  $scope.update = function(){
    if ($scope.contactForm.$valid){
      Contact.update({id: $scope.contact.id},{contact: $scope.contact},function(){
        $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };

}]);

myApp.controller("ContactAddCtr", ['$scope', '$resource', 'Contacts', '$location', function($scope, $resource, Contacts, $location) {
  $scope.contact = {}
  $scope.phone = /\d{10,15}/;
  $scope.save = function () {
    if ($scope.contactForm.$valid){
      Contacts.create({contact: $scope.contact}, function(){
        $location.path('/');
      }, function(error){
        console.log(error)
      });
    }
  }  

}]);



//Routes
myApp.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/contacts',{
      templateUrl: '/templates/contacts/index.html',
      controller: 'ContactListCtr'
    });
    $routeProvider.when('/contacts/new', {
      templateUrl: '/templates/contacts/new.html',
      controller: 'ContactAddCtr'
    });
    $routeProvider.when('/contacts/:id/edit', {
      templateUrl: '/templates/contacts/edit.html',
      controller: "ContactUpdateCtr"
    });
    $routeProvider.otherwise({
      redirectTo: '/contacts'
    });
  }
]);

