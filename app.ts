///<reference path="external/linq.d.ts"/>
///<reference path="external/angular.d.ts"/>

var mindPalaceApp = angular.module('mindPalaceApp', ['ngRoute',
    'projectsFactory','tagFactory','synchFactory',
    'checklist-model', 'cgNotify', 'ng-nestable']);

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
            when('/project/:projectId/tags', {
                templateUrl: 'tagTreeUpdater/tagTreeUpdater.html',
                controller: 'tagTreeUpdaterController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);
