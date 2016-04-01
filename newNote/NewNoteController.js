///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="../dataObjects/Note.ts"/>
///<reference path="../external/bootbox.d.ts"/>
///<reference path="..\dataObjects\Tag.ts"/>
///<reference path="..\dataObjects\TagNode.ts"/>
angular.module('mindPalaceApp').controller('NewNoteController', ['$scope', '$routeParams', 'projectsFactory', 'tagFactory', '$route', '$filter', '$controller', function ($scope, $routeParams, projectsFactory, tagFactory, $route, $filter, $controller) {
    var p = projectsFactory.getProject($routeParams.projectId, $routeParams.projectName);
    //We inherit from the parent (Refactoring)
    $controller('SynchronizeController', { $scope: $scope, $project: p });
    $scope.activeController = 'NewNoteController';
    $scope.generateTagTree = function () {
        //skin-menu
        var rootNode = new Btn('Browse').addClass('skin-root_menu');
        var allTags = tagFactory.getAll();
        var extracted = function (allTags, parentNode) {
            for (var i = 0; i < allTags.length; i++) {
                var currentTagNode = allTags[i];
                var currentNode = new Btn(currentTagNode.item.name);
                if (currentTagNode.children.length === 0) {
                    currentNode.on('click', $scope.nodeClicked(currentTagNode.item));
                }
                else {
                    extracted(currentTagNode.children, currentNode);
                }
                parentNode.append(currentNode);
            }
        };
        extracted(allTags, rootNode);
        rootNode.appendTo('#tagTreeDiv');
    };
    $scope.tagList = [];
    $scope.nodeClicked = function (tag) {
        return function () {
            if ($scope.tagList.indexOf(tag) === -1) {
                $scope.tagList.push(tag);
            }
            bootbox.hideAll();
            (!$scope.$$phase);
            $scope.$apply();
        };
    };
    $scope.showTagTree = function () {
        bootbox.dialog({
            message: "<div id='tagTreeDiv' style='padding: 200px;'></div>",
            title: 'Select a tag',
            buttons: {
                cancel: {
                    label: "Exit",
                    callback: function () {
                        //Close the modal.
                    }
                }
            }
        });
        $scope.generateTagTree();
    };
    $scope.validateAndAddNote = function () {
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
    };
}]);
//# sourceMappingURL=NewNoteController.js.map