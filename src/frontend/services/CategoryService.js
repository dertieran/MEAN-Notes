import { Make } from '../modules/make.js';
import EventTarget from '../prototypes/EventTarget.js';
import NetworkService from './NetworkService.js';
import '../directives/newCategoryDialog/NewCategoryDialogController.js';

let CategoryService = {




    categoryEditor : function($mdDialog, event, note){

        $mdDialog.show({
            controller: 'NewCategoryDialogController',
            templateUrl: './directives/NewCategoryDialog/Template.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            fullscreen: false,
        });
},


}
export default CategoryService;
