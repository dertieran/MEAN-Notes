import { Make } from '../modules/make.js';
import EventTarget from '../prototypes/EventTarget.js';
import NetworkService from './NetworkService.js';
import '../directives/NewNoteDialog/NewNoteDialogController.js';

let NoteService = Make({

    _currentNote : null,

    _currentNoteList : null,

    getNotes : function(amount, start = 0) {
        NetworkService.resource({ resource : `note/all`, method : 'GET' }).then(dataList => {
            this._currentNoteList = dataList;
            this.emit('notesAvailable', dataList);
        });
    },

    getCurrentNote : function(){
        return this._currentNote;
    },

    noteEditor : function($mdDialog, event, note){
        this._currentNote = note;

        $mdDialog.show({
            controller: 'NewNoteDialogController',
            templateUrl: './directives/NewNoteDialog/Template.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            fullscreen: false,
        });
    },

    saveNote : function(note){
        let request = null;

        if (!note._id) {
            request = NetworkService.resource({ resource : 'note', method : 'POST', data : note });
        } else {
            request = NetworkService.resource({ resource : `note/${note._id}`, method : 'PUT', data : note })
        }

        request.then(data => {
            if (note._id) {
                let index = this._currentNoteList.findIndex(item => {
                    return item._id === data._id;
                });

                this._currentNoteList.splice(index, 1, data);
            } else {
                this._currentNoteList.push(data);
            }

            return data;
        });
    }

}, EventTarget)();

export default NoteService;
