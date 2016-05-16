///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="../dataObjects/Note.ts"/>
///<reference path="../external/bootbox.d.ts"/>
///<reference path="..\dataObjects\Tag.ts"/>
///<reference path="..\dataObjects\TagNode.ts"/>

angular.module('mindPalaceApp').controller(
    'NewNoteController', ['$scope', '$routeParams', 'projectsFactory', 'tagFactory', '$route','$filter','$controller',
        function ($scope, $routeParams, projectsFactory, tagFactory, $route, $filter, $controller) {
            var p : Project= projectsFactory.getProject($routeParams.projectId,$routeParams.projectName);
            //We inherit from the parent (Refactoring)
            $controller('SynchronizeController', {$scope: $scope, $project : p});
            $controller('TagController', {$scope: $scope, $initialTagIds : []});

            $scope.activeController = 'NewNoteController';

            $scope.addTagToNote(tagFactory.getDefaultTag());

            $scope.validateAndAddNote = function() {
                //basic validation
                if (!$scope.noteTitle) {
                    return true;
                }
                var newNote = new Note();
                newNote.title = $scope.noteTitle;
                newNote.content = $scope.noteContent;
                newNote.tagIds = Enumerable.from<Tag>($scope.tagList).select(o=>o.id).toArray();
                p.noteList.push(newNote);
                projectsFactory.saveProject(p);
                console.debug("New note added");
                $scope.noteTitle = "";
                $scope.noteContent = "";
            }
        }]);