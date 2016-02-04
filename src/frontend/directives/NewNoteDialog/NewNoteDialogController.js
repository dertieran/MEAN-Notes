import { application } from '../../modules/angular.js';
import { Make } from '../../modules/make.js';
import Note from '../../prototypes/Note.js';
import NoteService from '../../services/NoteService.js';

application.controller('NewNoteDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog){

    if (NoteService.getCurrentNote()) {
        $scope.note = NoteService.getCurrentNote().clone();
    } else {
        $scope.note = Make(Note)();
    }

    $scope.note.startdate = new Date($scope.note.startdate);
    $scope.note.enddate = new Date($scope.note.enddate);

    $scope.$mdDialog = $mdDialog;

    $scope.saveNote = function(){
        let note = $scope.note.clone();

        note.startdate = note.startdate.getTime();
        note.enddate = note.enddate.getTime();

        NoteService.saveNote(note);
    }

}]);
