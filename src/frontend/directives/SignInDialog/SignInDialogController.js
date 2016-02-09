import { application } from '../../modules/angular.js';
import UserService from '../../services/UserService.js';

application.controller('SignInDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog){

    $scope.user = {};

    $scope.login = function(user){
        UserService.login(user).then(() => {
            $mdDialog.hide();
        });
    }

    $scope.register = function(user){
        UserService.register(user).then(() => {
            $mdDialog.hide();
        });
    }


}]);
