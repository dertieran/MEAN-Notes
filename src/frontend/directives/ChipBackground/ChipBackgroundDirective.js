import { application } from '../../modules/angular.js';

application.directive('appChipBg', [function(){

    return {
        restrict : 'A',
        scope : {
            color : '=appChipBg'
        },

        link : function(scope, element){
            scope.watch('color', function(value){
                element[0].parentNode.parentNode.style.backgroundColor = value;
            });

            element[0].parentNode.parentNode.style.backgroundColor = scope.color;
        }
    };

}]);
