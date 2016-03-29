///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="../dataObjects/Note.ts"/>
///<reference path="../external/bootbox.d.ts"/>
///<reference path="..\dataObjects\Tag.ts"/>

declare var Btn: any;

angular.module('mindPalaceApp').controller(
    'NewNoteController', ['$scope', '$routeParams', 'projectsFactory', 'tagFactory', '$route','$filter','$controller',
        function ($scope, $routeParams, projectsFactory, tagFactory, $route, $filter, $controller) {
            var p : Project= projectsFactory.getProject($routeParams.projectId,$routeParams.projectName);
            //We inherit from the parent (Refactoring)
            $controller('SynchronizeController', {$scope: $scope, $project : p});
            $scope.activeController = 'NewNoteController';
            $scope.generateTagTree = function() {
                //skin-menu

                var rootNode = new Btn('Browse').addClass('skin-root_menu');
                /*rootNode.append(
                    new Btn("Default tag").on('click', $scope.alertEvent('Id:'+0))
                );*/
                var generateBranch = function (processingTagNumber:number, processingNode) : number {
                    var allTags = tagFactory.getAll();
                    var nbChild = 0;
                    for (var i = 0; i < allTags.length; i++) {
                        var currentTag = allTags[i];
                        if (currentTag.parent == processingTagNumber) {
                            //new leaf!
                            nbChild++;
                            var currentNode = new Btn(currentTag.name);
                            var currentNodeChildNumber = generateBranch(currentTag.id, currentNode);
                            if(currentNodeChildNumber == 0){
                                currentNode.on('click', $scope.nodeClicked(currentTag));
                            }
                            /*else{
                                alert("ignoring because of child"+currentNodeChildNumber+" (parent="+processingTagNumber);
                            }*/
                            processingNode.append(
                                currentNode
                            );
                        }
                    }
                    //alert("id"+processingTagNumber+"returned "+nbChild);
                    return nbChild;
                };
                generateBranch(0,rootNode);
                // Appending the button menu to the DOM - `#main` element
                rootNode.appendTo( '#tagTreeDiv' );



            }

            $scope.tagList = [];

            $scope.nodeClicked = function(tag : Tag) {
                return function() {
                    if($scope.tagList.indexOf(tag) ===-1) {
                        $scope.tagList.push(tag);
                    }
                    bootbox.hideAll();
                    (!$scope.$$phase)
                        $scope.$apply();
                };
            }
            $scope.showTagTree = function() {
                bootbox.dialog({
                    message:"<div id='tagTreeDiv' style='padding: 200px;'></div>",
                    title: 'Select a tag',
                    buttons: {
                        cancel: {
                            label: "Exit",
                            callback: function() {
                                //Close the modal.
                            }
                        }
                    }
                });
                $scope.generateTagTree();
            }
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