import {　application } from '../../modules/angular.js';
import NoteService from '../../services/NoteService.js';
import CategoryService from '../../services/CategoryService.js';

application.controller('NoteCardController', ['$scope', '$mdDialog', function($scope, $mdDialog){

    $scope.formatDate = function(time) {
        return (new Date(time)).toLocaleDateString();
    };

    $scope.editNote = function(event){
        NoteService.noteEditor($mdDialog, event, $scope.model);
    };

    $scope.getCategoryColor = function(category){
        category = CategoryService.getCategory(category);

        if (category) {
            return category.color;
        } else {
            return '';
        }
    };

    $scope.deleteNote = function(){
        NoteService.deleteNote($scope.model).then(() => $scope.$apply());
    }
}]);
