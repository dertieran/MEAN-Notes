import { application } from '../../modules/angular.js';
import { Make } from '../../modules/make.js';
import Category from '../../prototypes/Category.js';
import CategoryService from '../../services/CategoryService.js';

application.controller('NewCategoryDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog){


    $scope.$mdDialog = $mdDialog;

    if (CategoryService.getCurrentCategory()) {
        $scope.category = CategoryService.getCurrentCategory().clone();
    } else {
        $scope.category = Make(Category)();
    }

    $scope.saveCategory = function(){
        CategoryService.saveCategory($scope.category).then(() => $mdDialog.hide());
    };


}]);
