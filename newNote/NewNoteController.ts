///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="../dataObjects/Note.ts"/>
///<reference path="../external/bootbox.d.ts"/>
///<reference path="..\dataObjects\Tag.ts"/>
///<reference path="..\dataObjects\TagNode.ts"/>

declare var Btn: any;

angular.module('mindPalaceApp').controller(
    'NewNoteController', ['$scope', '$routeParams', 'projectsFactory', 'tagFactory', '$route','$filter','$controller',
        function ($scope, $routeParams, projectsFactory, tagFactory, $route, $filter, $controller) {
            var p : Project= projectsFactory.getProject($routeParams.projectId,$routeParams.projectName);
            //We inherit from the parent (Refactoring)
            $controller('SynchronizeController', {$scope: $scope, $project : p});
            $scope.activeController = 'NewNoteController';

            $scope.handleTagText = function(newTagText) {
                console.debug('handling TagText '+ newTagText);
                var existingTag = Enumerable.from<TagNode>(tagFactory.getAll()).where(o=> o.tag.name == newTagText).firstOrDefault();
                var tagToAdd : Tag;
                if(!existingTag){
                    tagToAdd = tagFactory.getNewTag(newTagText);
                }
                else
                {
                    tagToAdd = existingTag.tag;
                }
                addTagToNote(tagToAdd);
            }

            $scope.generateTagTree = function() {
                //skin-menu

                var rootNode = new Btn('Browse').addClass('skin-root_menu');
                var allTags = tagFactory.getAll();

                var extracted = function (allTags, parentNode) {
                    for (var i = 0; i < allTags.length; i++) {
                        var currentTagNode:TagNode = allTags[i];
                        var currentNode = new Btn(currentTagNode.tag.name);
                        if (!currentTagNode.children || currentTagNode.children.length === 0) {
                            currentNode.on('click', $scope.nodeClicked(currentTagNode.tag));
                        }
                        else
                        {
                            extracted(currentTagNode.children, currentNode);
                        }

                        parentNode.append(
                            currentNode
                        );
                    }
                };
                extracted(allTags, rootNode);
                rootNode.appendTo( '#tagTreeDiv' );
            }

            $scope.tagList = [];

            var addTagToNote = function (tag : Tag) {
                if ($scope.tagList.indexOf(tag) === -1) {
                    $scope.tagList.push(tag);
                }
            };
            addTagToNote(tagFactory.getDefaultTag());

            $scope.unlinkTag = function (tag : Tag) {
                //http://stackoverflow.com/questions/5767325/remove-a-particular-element-from-an-array-in-javascript
                var index = $scope.tagList.indexOf(tag);
                if (index > -1) {
                    $scope.tagList.splice(index, 1);
                }
            };

            $scope.nodeClicked = function(tag : Tag) {
                return function() {
                    addTagToNote(tag);
                    bootbox.hideAll();
                    (!$scope.$$phase)
                        $scope.$apply();
                };
            }

            $scope.addNewTag = function() {
                bootbox.prompt({
                    title: 'Create a Tag',
                    placeholder: 'Enter tag name...',
                    callback: function (result) {
                        if (result !== null) {
                            $scope.$apply(function() {
                                $scope.handleTagText(result);
                            });
                        }
                    }
                });
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
                newNote.tagIds = Enumerable.from<Tag>($scope.tagList).select(o=>o.id).toArray();
                p.noteList.push(newNote);
                projectsFactory.saveProject(p);
                console.debug("New note added");
                $scope.noteTitle = "";
                $scope.noteContent = "";
            }
        }]);