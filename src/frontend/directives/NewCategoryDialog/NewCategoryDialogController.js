import { application } from '../../modules/angular.js';
import { Make } from '../../modules/make.js';
import Note from '../../prototypes/Note.js';
import CategoryService from '../../services/CategoryService.js';

application.controller('NewCategoryDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog){


    $scope.$mdDialog = $mdDialog;


    $scope.saveCategory = function(){
        let category = $scope.category.clone();

        CategoryService.saveCategory(category);
    }


}]);
