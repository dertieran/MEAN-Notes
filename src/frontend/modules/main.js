import {　application } from './angular.js';
import './directives.js';
import { Router, RouteController } from './Router.js';

application.config(function($routeProvider, $mdThemingProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey', {
            'default': '600',
            'hue-1': '200',
            'hue-2': '400',
            'hue-3': 'A100'
        })

        .accentPalette('orange', {
            'default': '200'
        })

        .warnPalette('red',{
            'default': '800'
        })

        .backgroundPalette('teal', {
            'default' : '50',
            'hue-1' : '100'
        });

        Router($routeProvider, [{route: 'tec-demo', directive: 'app-page-tec-demo'},
                  {route: '/sign-in', directive: 'app-page-signin'},
                  {route: '/explore', directive: 'app-page-explore', header: true, title: 'Explore'},
                  {route: '/home', directive: 'app-page-home'},
                  {route: '/publish/:id?', path : '/publish', directive: 'app-page-publish', header: true, title: 'Publish Idea'},
                  {route: '/about-us', directive: 'app-page-about-us', header: true, title: 'About us'},
                  {route: '/user/edit', directive: 'app-page-user-edit'},
                  {route: '/user/dashboard', directive: 'app-page-dashboard'},
                  {route: '/user/sidemenu', directive: 'app-page-side-menu'},
                  {route: '/project/:id', directive: 'app-page-project-page'}]
                  , '/home');

}).run(function($rootScope){
    RouteController($rootScope);
})
