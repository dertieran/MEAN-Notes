angular.module('app-mmi').directive('sidemenu', function(){
	return {
		restrict : 'E',
		scope : {},
		templateUrl : './directives/sidemenu/Template.html',
        controller : 'SideMenuController'
	}
})
