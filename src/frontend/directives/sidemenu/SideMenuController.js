import { application } from '../../modules/angular.js';
import CategoryService from '../../services/CategoryService.js';
import UserService from '../../services/UserService.js';

application.controller("SideMenuController", ['$scope', '$mdDialog', function($scope, $mdDialog) {

    UserService.signIn($mdDialog, null);

    CategoryService.on('categoriesAvailable', categoryList => {
        $scope.categories = categoryList;
        $scope.$apply();
    });

    CategoryService.getCategories();



    $scope.add = function() {
        $scope.categories.push($scope.newCategory);
        $scope.newCategory =
        {
            name : '',
            color : ''
        };
    };

    $scope.delete = function(category) {
        $scope.categories.splice( $scope.categories.indexOf(category), 1 );
    };


    $scope.openDialog = function(event) {
        CategoryService.categoryEditor($mdDialog, event);
    };

}]);
