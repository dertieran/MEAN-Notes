import '../libs/angular/angular.min.js';
import '../libs/angular/angular-aria.min.js';
import '../libs/angular/angular-animate.min.js';
import '../libs/angular/angular-material.min.js';
import '../libs/angular/angular-route.min.js';
import '../libs/angular/angular-sanitize.min.js';

export let application = angular.module('app-mean-notes', ['ngMaterial', 'ngRoute', 'ngAnimate', 'ngSanitize', 'mdColorPicker']);
