///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
angular.module('mindPalaceApp').controller(
    'NoteUpdateController', ['$scope', '$routeParams', '$location', 'projectsFactory', 'tagFactory',
        function ($scope, $routeParams, $location, projectsFactory, tagFactory) {
            var project = projectsFactory.getProject($routeParams.projectId);
            var note = getNote(project,$routeParams.noteId);

            $scope.projectName = project.name;

            $scope.title = note.title;
            $scope.content = note.content;
            $scope.creationTime = note.creationTime;
            $scope.updateTime = note.lastUpdated;
           


            $scope.saveNote = function() {
                if(isNaN($scope.amount)){
                    return true;
                }
                note.title = $scope.title;
                note.content = $scope.content;

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