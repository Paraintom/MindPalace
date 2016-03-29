///<reference path="external/linq.d.ts"/>
///<reference path="external/angular.d.ts"/>

var mindPalaceApp = angular.module('mindPalaceApp', ['ngRoute',
    'projectsFactory','tagFactory','synchFactory',
    'checklist-model', 'cgNotify']);

mindPalaceApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'listGroups/listGroups.html',
                controller: 'ListGroupsController'
            }).
            when('/project/:projectId/newNote/', {
                templateUrl: 'newNote/newNote.html',
                controller: 'NewNoteController'
            }).
            when('/project/:projectId/browse', {
                templateUrl: 'NoteListDisplay/browseNotes.html',
                controller: 'NoteListController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
