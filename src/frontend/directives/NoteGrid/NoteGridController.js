import { application } from '../../modules/angular.js';
import NoteService from '../../services/NoteService.js';
import UserService from '../../services/UserService.js';

application.controller('NoteGridController', ['$scope', '$mdDialog', function($scope, $mdDialog){

    $scope.loginDone = false;

    NoteService.on('notesAvailable', noteList => {
        $scope.noteList = noteList;
        $scope.$apply();
    });

    UserService.on('tokenReady', () => {
        $scope.loginDone = true;
    });

    UserService.on('signOut', () => $scope.loginDone = false);

    if (UserService.userId) {
        NoteService.getNotes();
    } else {
        UserService.on('userReady', NoteService.getNotes.bind(NoteService));
    }

    $scope.getCardSize = function(note){
        if (note.content.length < 600) {
            return 3;
        } else if (note.content.length < 1000) {
            return 6;
        } else if (note.content.length < 1500) {
            return 9;
        } else {
            return 12;
        }
    };

    $scope.openDialog = function(event) {
        NoteService.noteEditor($mdDialog, event);
    };
}])
