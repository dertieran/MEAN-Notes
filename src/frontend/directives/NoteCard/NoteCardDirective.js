import { application } from '../../modules/angular.js';
import './NoteCardController.js';

application.directive('appNoteCard', [function(){

    return {
        restrict : 'E',
        scope : {
            model : '=ngModel'
        },
        controller : 'NoteCardController',
        templateUrl : 'directives/NoteCard/Template.html'
    };

}]);
