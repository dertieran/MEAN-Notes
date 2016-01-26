import { application } from '../../modules/angular.js';

application.controller('NoteGridController', ['$scope', function($scope){
    $scope.noteList = [
        {
            _id : '083049849358',
            title : 'Test Test haha',
            content : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            categories : ['test', 'note', 'card', 'stuff'],
            startdate : 53908724,
            enddate: 120998578
        },
        {
            _id : '083049849358',
            title : 'Test 12 haha',
            content : 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   ',
            categories : ['test', '543', 'zeug', '123'],
            startdate : 97875429,
            enddate: 80978879872
        },
        {
            _id : '083049849358',
            title : 'Test this haha',
            content : '12453jlkjanlvlj',
            categories : ['test', 'note', 'new'],
            startdate : 98982309,
            enddate: 97897609932,
        },
        {
            _id : '083049849358',
            title : 'Test Test Test Test',
            content : '12453jlkjanlvlj',
            categories : ['test', 'card'],
            startdate : 98623612,
            enddate : 7968809988,
        },
    ];

    $scope.getCardSize = function(note){
        if (note.content.length < 600) {
            return 3;
        } else {
            return 4;
        }
    };
}])
