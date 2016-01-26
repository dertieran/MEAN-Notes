import {　application } from '../../modules/angular.js';

application.controller('NoteCardController', ['$scope', function($scope){

    $scope.formatDate = function(time) {
        return (new Date(time)).toLocaleDateString();
    }
}]);
