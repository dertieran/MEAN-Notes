import { Make } from '../modules/make.js';
import EventTarget from '../prototypes/EventTarget.js';
import NetworkService from './NetworkService.js';
import UserService from './UserService.js';
import '../directives/NewNoteDialog/NewNoteDialogController.js';
import Note from '../prototypes/Note.js';

let NoteService = Make({

    _currentNote : null,

    _currentNoteList : null,

    getNotes : function(amount, start = 0) {
        NetworkService.resource({ 
            resource : `user/${UserService.userId}/note/all`,
            method : 'GET',
            authenticate : true
        }).then(dataList => {
            this._currentNoteList = dataList.map(note => {
                return Make(note, Note).get();
            });
            this.emit('notesAvailable', this._currentNoteList);
        });
    },

    filterNotes : function(categories) {
        NetworkService.resource({
            resource : `user/${UserService.userId}/note/all`,
            method : 'GET',
            authenticate : true,
            data : {
                categories : categories
            },
        })
        .then(list => {
            this._currentNoteList = list.map(note => Make(note, Note).get());
            this.emit('notesAvailable', this._currentNoteList);
        })
    },

    getCurrentNote : function(){
        return this._currentNote;
    },

    noteEditor : function($mdDialog, event, note){
        this._currentNote = note;

        return $mdDialog.show({
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
            request = NetworkService.resource({ resource : `user/${UserService.userId}/note`, method : 'POST', data : note });
        } else {
            request = NetworkService.resource({ resource : `user/${UserService.userId}/note/${note._id}`, method : 'PUT', data : note })
        }

        return request.then(data => {
            data = Make(data, Note).get();

            if (note._id) {
                let index = this._currentNoteList.findIndex(item => {
                    return item._id === data._id;
                });

                this._currentNoteList[index] = data;
            } else {
                this._currentNoteList.push(data);
            }

            return data;
        });
    },

    deleteNote : function(note) {
        return NetworkService.resource({
            resource : `user/${UserService.userId}/note/${note._id}`,
            method : 'DELETE',
            authenticate : true
        }).then(() => {
            let index = this._currentNoteList.findIndex(item => item._id === note._id);

            this._currentNoteList.splice(index, 1);
        });
    }

}, EventTarget)();

export default NoteService;
