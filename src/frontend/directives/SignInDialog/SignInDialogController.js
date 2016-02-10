import { application } from '../../modules/angular.js';
import UserService from '../../services/UserService.js';

application.controller('SignInDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog){

    $scope.user = {};

    $scope.login = function(user){
        UserService.login(user).then(() => {
            $mdDialog.hide();
        }, error => {
            if (error.status == 401){
                $scope.error = 'Email or Password is wrong';
                $scope.$apply();
            } else {
                $scope.error = 'Sorry this should not happen';
                $scope.$apply();
            }
        });
    }

    $scope.register = function(user){
        UserService.register(user).then(() => {
            $mdDialog.hide();
        }, error => {
            if (error.status == 409){
                $scope.error = 'Email already exists';
                $scope.$apply();
            } else {
                $scope.error = 'Sorry this should not happen';
                $scope.$apply();
            }
        });
    }


}]);
