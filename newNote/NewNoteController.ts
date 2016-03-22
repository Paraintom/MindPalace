///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="../dataObjects/Note.ts"/>

angular.module('mindPalaceApp').controller(
    'NewNoteController', ['$scope', '$routeParams', 'projectsFactory', '$route','$filter','$controller',
        function ($scope, $routeParams, projectsFactory, $route, $filter, $controller) {
            var p : Project= projectsFactory.getProject($routeParams.projectId,$routeParams.projectName);
            //We inherit from the parent (Refactoring)
            $controller('SynchronizeController', {$scope: $scope, $project : p});
            $scope.activeController = 'NewNoteController';

            $scope.validateAndAddNote = function() {
                //basic validation
                if (!$scope.noteTitle) {
                    return true;
                }
                var newNote = new Note();
                newNote.title = $scope.noteTitle;
                newNote.content = $scope.noteContent;
                p.noteList.push(newNote);
                projectsFactory.saveProject(p);
                console.debug("New note added");
                $scope.noteTitle = "";
                $scope.noteContent = "";
            }
        }]);