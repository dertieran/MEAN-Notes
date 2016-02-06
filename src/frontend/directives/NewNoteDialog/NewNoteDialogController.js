import { application } from '../../modules/angular.js';
import { Make } from '../../modules/make.js';
import Note from '../../prototypes/Note.js';
import NoteService from '../../services/NoteService.js';
import CategoryService from '../../services/CategoryService.js';

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

        NoteService.saveNote(note).then(() => {
            $mdDialog.hide();
        })
    };

    $scope.autoComplete = {
        text : '',
        selectedItem : null,
        categoryList : [],
        _filtered : [],
        _lastText : '',

        filterCategories : function(){
            if (this.text !== this._lastText) {
                this._filtered = this.categoryList.filter(category => category.name.toLowerCase().indexOf(this.text.toLowerCase()) > -1);
            }

            return this._filtered;
        },

        transform : function(item) {
            return item.name;
        }
    };

    $scope.getChipColor = function(name) {
        let category = CategoryService.getCategory(name);

        return category ? category.color : '';
    };

    CategoryService.on('categoriesAvailable', list => $scope.autoComplete.categoryList = list);

}]);
