import { Make } from '../modules/make.js';
import EventTarget from '../prototypes/EventTarget.js';
import UserService from './UserService.js';
import NetworkService from './NetworkService.js';
import '../directives/NewCategoryDialog/NewCategoryDialogController.js';

let CategoryService = Make({


    _currentCategoryList : [],

    _currentCategory : null,

    _make : function(){
        EventTarget._make.apply(this);

        this.defineEvent('categoriesAvailable', {
            persistent : true
        });
    },

    getCategories : function() {

        return NetworkService.resource({ resource: `user/${UserService.userId}/category`, method : 'GET', authenticate : true })
            .then(categoryList => {
                this._currentCategoryList = categoryList;
                this.emit('categoriesAvailable', categoryList)
            });
    },

    getCategory : function(name) {
        return this._currentCategoryList.find(category => category.name == name);
    },

    categoryEditor : function($mdDialog, event){

        $mdDialog.show({
            controller: 'NewCategoryDialogController',
            templateUrl: './directives/NewCategoryDialog/Template.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            fullscreen: false,
        });
    },

    getCurrentCategory : function(){
        return this._currentCategory;
    },

    saveCategory : function(category){
        let categoryList = Array.isArray(category) ? category : this._currentCategoryList.slice();

        if (!Array.isArray(category)) {
            let index = categoryList.findIndex(item => item.name === category.name);

            if (index > -1) {
                categoryList[index] = category;
            } else {
                categoryList.push(category);
            }
        }

        return NetworkService.resource({
            resource : `user/${UserService.userId}/category`,
            method : 'PUT',
            data : categoryList
        }).then(list => {
            this._currentCategoryList = list;
            this.emit('categoriesAvailable', list);
        });
    }

}, EventTarget)();

export default CategoryService;
