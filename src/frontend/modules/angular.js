import '../libs/angular/angular.min.js';
import '../libs/angular/angular-aria.min.js';
import '../libs/angular/angular-animate.min.js';
import '../libs/angular/angular-material.js';
import '../libs/angular/angular-route.min.js';
import '../libs/angular/angular-sanitize.min.js';
import '../libs/angular/angular-messages.min.js';
import '../libs/angular-color-picker.js';

export let application = angular.module('app-mean-notes', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngAnimate', 'ngSanitize', 'mp.colorPicker']);
