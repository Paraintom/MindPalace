///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="../dataObjects/LiteEvent.ts"/>
///<reference path="../RequestFlicker/ServiceLookup.ts"/>
///<reference path="../RequestFlicker/RequestFlicker.ts"/>
///<reference path="../external/bootbox.d.ts"/>
///<reference path="..\dataObjects\TagNode.ts"/>

declare var Btn: any;

angular.module('mindPalaceApp').controller(
    'TagController', ['$scope', '$routeParams', '$controller','$initialTagIds','tagFactory',
        function ($scope, $routeParams, $controller,$initialTagIds : number[], tagFactory) {

            function InitTagList(initialTagIds : number[]) : Tag[]{
                var result = [];
                if(initialTagIds.length == 0){
                    return result;
                }
                var allTags = tagFactory.getAll();

                //Not very efficient, but let's not do premature optimisation.
                for(var i = 0;i<initialTagIds.length;i++){
                    var tagIdToLookup = initialTagIds[i];
                    for(var j = 0;j<allTags.length;j++){
                        var tagNode = allTags[j];
                        if(tagIdToLookup == tagNode.tag.id){
                            result.push(tagNode.tag);
                            break;
                        }
                    }
                }
                return result;
            };

            $scope.tagList = InitTagList($initialTagIds);

            $scope.addTagFromText = function(newTagText : string) {
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
                $scope.addTagToNote(tagToAdd);
            };


            $scope.nodeClicked = function(tag : Tag) {
                return function() {
                    $scope.addTagToNote(tag);
                    bootbox.hideAll();
                    (!$scope.$$phase)
                    $scope.$apply();
                };
            };

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
            };

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
            };

            $scope.removeTagLink= function(tag : Tag) {
                //http://stackoverflow.com/questions/5767325/remove-a-particular-element-from-an-array-in-javascript
                var index = $scope.tagList.indexOf(tag);
                if (index > -1) {
                    $scope.tagList.splice(index, 1);
                }
            };

            $scope.addTagToNote = function (tag : Tag) {
                if ($scope.tagList.indexOf(tag) === -1) {
                    $scope.tagList.push(tag);
                }
            };
            $scope.addNewTag = function() {
                bootbox.prompt({
                    title: 'Create a Tag',
                    placeholder: 'Enter tag name...',
                    callback: function (result) {
                        if (result !== null) {
                            $scope.$apply(function() {
                                $scope.addTagFromText(result);
                            });
                        }
                    }
                });
            };
        }]);