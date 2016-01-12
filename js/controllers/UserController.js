mainApp.controller('UserController', function($scope, $routeParams, $route){
  console.log("This is UserController");
  $scope.username = $routeParams.id;

  $scope.reload = function() {
    $route.reload();
  }

});
