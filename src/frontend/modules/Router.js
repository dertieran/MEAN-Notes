var routelist;

/**
 * @param {Object} routes
 */
export let Router = function($routeProvider, routes, otherwise) {
    routes.forEach(key => {
        $routeProvider.when(key.route, {
            template : `<${key.directive} flex="grow" layout></${key.directive}>`
        });
    });
    routelist = routes;
    $routeProvider.otherwise(otherwise);

    return otherwise;
}

export let RouteController = function($rootScope){
    // $rootScope.$on('$routeChangeStart', () => {
    // 
    //     UserService.user.then(user => {
    //         if (user.incomplete) {
    //             location.hash = '/user/edit';
    //         }
    //     }, () => {});
    //
    // });
}

export let RouteListener = function(){
  return routelist;
}
