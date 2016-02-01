import { application } from '../../modules/angular.js';

application.controller("SideMenuController", ['$scope', function($scope, $mdDialog) {

    $scope.categories = [];

    $scope.add = function() {
        $scope.categories.push($scope.newCategory);
        $scope.newCategory =
        {
            name : '',
            color : ''
        };
    };

    $scope.doSecondaryAction = function(event) {
        $mdDialog.show(
            $mdDialog.alert()
            .title('Secondary Action')
            .textContent('Secondary actions can be used for one click actions')
            .ariaLabel('Secondary click demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };

}]);
