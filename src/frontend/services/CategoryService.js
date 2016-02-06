import { Make } from '../modules/make.js';
import EventTarget from '../prototypes/EventTarget.js';
import NetworkService from './NetworkService.js';
import '../directives/newCategoryDialog/NewCategoryDialogController.js';

let CategoryService = Make({


    _currentCategoryList : null,

    getCategories : function(amount, start = 0) {

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

}, EventTarget)();

export default CategoryService;
