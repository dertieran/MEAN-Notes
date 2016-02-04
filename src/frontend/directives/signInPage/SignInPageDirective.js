import { application } from '../../modules/angular.js';

application.directive('appPageSignin', function(){

    return {
        restrict:'E',
        scope: {},
		templateUrl:'./directives/signInPage/Template.html',
	};

});
