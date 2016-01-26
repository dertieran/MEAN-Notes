import {　application } from '../../modules/angular.js';
import './SideMenuController.js';

application.directive('appSideMenu', function(){
	return {
		restrict : 'E',
		scope : {},
		templateUrl : 'directives/sidemenu/Template.html',
        controller : 'SideMenuController'
	}
})
