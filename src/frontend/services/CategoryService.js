import { Make } from '../modules/make.js';
import EventTarget from '../prototypes/EventTarget.js';
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

        let categoryList = [
            {
                name: "Category 4",
                color: "#c72222"
            },
            {
                name: "Category 5",
                color: "#239eea"
            },
            {
                name: "Category 6",
                color: "#3fbe0e"
            }
        ];


        this._currentCategoryList = categoryList;
        this.emit('categoriesAvailable', categoryList)
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
    }

}, EventTarget)();

export default CategoryService;
