import { application } from '../../modules/angular.js';
import CategoryService from '../../services/CategoryService.js';
import UserService from '../../services/UserService.js';
import NoteService from '../../services/NoteService.js';

application.controller("SideMenuController", ['$scope', '$mdDialog', function($scope, $mdDialog) {

    $scope.filters = {};
    $scope.loginDone = false;

    UserService.signIn($mdDialog, null);

    CategoryService.on('categoriesAvailable', categoryList => {
        $scope.categories = categoryList;
        $scope.$apply();
    });

    UserService.on('tokenReady', () => {
        $scope.loginDone = true;
    });

    if (UserService.userId) {
        CategoryService.getCategories();
    } else {
        UserService.on('userReady', CategoryService.getCategories.bind(CategoryService));
    }

    $scope.deleteCategory = function(category) {
        let list = $scope.categories.slice();

        list.splice($scope.categories.indexOf(category), 1);
        CategoryService.saveCategory(list);
    };

    $scope.filterNotes = function(){
        let list = Object.keys($scope.filters).filter(item => $scope.filters[item]);

        NoteService.filterNotes(list);
    }


    $scope.openDialog = function(event) {
        CategoryService.categoryEditor($mdDialog, event);
    };

}]);
