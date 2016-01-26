import { application } from '../../modules/angular.js';
import './NoteGridController.js';

application.directive('appNoteGrid', [function(){

    return {
        restrict : 'E',
        scope : {},
        controller : 'NoteGridController',
        templateUrl : 'directives/NoteGrid/Template.html'
    };

}]);
