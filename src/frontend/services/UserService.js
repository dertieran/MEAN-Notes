import { Make } from '../modules/make.js';
import EventTarget from '../prototypes/EventTarget.js';
import NetworkService from './NetworkService.js';
import '../directives/SignInDialog/SignInDialogController.js';

let UserService = Make({

    _userID : null,

    _token : sessionStorage.getItem('mean-notes.token'),

    getToken : function(){
        return this._token;
    },

    register : function(input){
        return NetworkService.resource({ resource : `user`, method : 'POST', data : input }).then(user => {
            this._userID = user.userID;
            this._token = user.token;
            sessionStorage.setItem('mean-notes.token', this._token);

            this.emit('tokenReady', this._token);
            this.emit('userReady');
        });
    },

    login : function(input){
        return NetworkService.resource({ resource : `session`, method : 'POST', data : input }).then(user => {
            this._userID = user.userID;
            this._token = user.token;
            sessionStorage.setItem('mean-notes.token', this._token);

            this.emit('tokenReady', this._token);
            this.emit('userReady');
        });
    },

    signIn : function($mdDialog, event){

        if (this._token) {
            NetworkService.resource({ 
                resource : `session`,
                method : 'GET',
            }).then(user => {
                this._userID = user.userID;

                this.emit('userReady');
            }, () => this.openLoginDialog($mdDialog, event));
        } else {
            this.openLoginDialog($mdDialog, event)
        }
    },

    signOut : function($mdDialog, event){
        this._token = null;
        this._userID = null;
        sessionStorage.removeItem('mean-notes.token');
        this.emit('signOut');

        this.openLoginDialog($mdDialog, event);
    },

    openLoginDialog : function($mdDialog, event){
        return $mdDialog.show({
            controller: 'SignInDialogController',
            templateUrl: './directives/SignInDialog/Template.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:false,
            fullscreen: true,
        });
    },

    /**
    * @constructs
    */
    _make : function(){
        EventTarget._make.apply(this);

        this.defineEvent('tokenReady', { persistent : true });

        if(this._token){
            this.emit('tokenReady');
        }
    },

    get userId(){
        return this._userID;
    }

}, EventTarget)();

export default UserService;
