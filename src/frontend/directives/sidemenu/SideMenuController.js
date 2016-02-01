import { application } from '../../modules/angular.js';

application.controller("SideMenuController", ['$scope', function($scope) {

    $scope.categories = [
        {
            name: "Category 1",
            color: "#c72222"
        },
        {
            name: "Category 2",
            color: "#239eea"
        },
        {
            name: "Category 3",
            color: "#3fbe0e"
        }
    ];

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

}]);
