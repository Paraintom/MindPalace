///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
angular.module('mindPalaceApp').controller(
    'NoteUpdateController', ['$scope', '$routeParams', '$location', 'projectsFactory', 'tagFactory', '$controller',
        function ($scope, $routeParams, $location, projectsFactory, tagFactory, $controller) {
            var project = projectsFactory.getProject($routeParams.projectId);
            var note = getNote(project,$routeParams.noteId);

            //console.debug('in child'+$scope.tagList.length);
            $controller('TagController', {$scope: $scope, $initialTagIds : note.tagIds});

            $scope.projectName = project.name;

            $scope.title = note.title;
            $scope.content = note.content;
            $scope.creationTime = note.creationTime;
            $scope.updateTime = note.lastUpdated;


            $scope.saveNote = function() {
                //console.debug("saveNote called");
                note.title = $scope.title;
                note.content = $scope.content;
                note.tagIds = Enumerable.from<Tag>($scope.tagList).select(o=>o.id).toArray();
                console.debug("her"+note.tagIds.length);
                if($routeParams.transactionId == 0/*mean a new transaction*/) {
                    project.transactions.push(note);
                }
                else{
                    note.HasBeenUpdated();
                }
                projectsFactory.saveProject(project);
                $scope.back();
                return false;
            };

            function getNote(project : Project, noteId : string) : Note{

                if(noteId == '0'){
                    return new Note();
                }
                //We try to get the existing transaction
                var allNotes = Enumerable.from<Note>(project.noteList);
                var existing = allNotes.where(
                    function (o) {return o.id == noteId}
                ).firstOrDefault();
                var result = existing;

                //Else we create a new one : note the Guid will be different...
                if(existing == null) {
                    result = new Note();
                }
                return result;
            }

            $scope.back = function() {
                window.history.back();
            };
        }]);