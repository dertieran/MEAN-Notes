import { application } from '../../modules/angular.js';

application.controller("SideMenuController", ['$scope', function($scope) {

    $scope.categories = [
        {
            name : 'Category 1'
        },
        {
            name : 'Category 2'
        },
        {
            name : 'Category 3'
        },
        {
            name : 'Category 4'
        },
        {
            name : 'Category 5'
        },
    ];

}]);
