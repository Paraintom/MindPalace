///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="..\dataObjects\TagNode.ts"/>


angular.module('mindPalaceApp').controller(
    'tagTreeUpdaterController', ['$scope', '$routeParams', 'projectsFactory', 'tagFactory', '$route','$filter','$controller',
        function ($scope, $routeParams, projectsFactory, tagFactory, $route, $filter, $controller) {
            var p : Project= projectsFactory.getProject($routeParams.projectId,$routeParams.projectName);
            //We inherit from the parent (Refactoring)
            $controller('SynchronizeController', {$scope: $scope, $project : p});
            $scope.activeController = 'tagTreeUpdaterController';
            $scope.treeDelete = [];
            var deleteTagNode = new TagNode();
            deleteTagNode.children = [];
            deleteTagNode.tag = new Tag();
            deleteTagNode.tag.id = -1;
            deleteTagNode.tag.name = "Delete tags dragging them in this section!";
            $scope.treeDelete.push(deleteTagNode);
            $scope.treeTagProject =  tagFactory.getAll();
            $scope.$watchCollection('treeTagProject', onTreeChanged);

            function onTreeChanged(newValue, oldValue){
                function handleChildren(itemList, tagList) {
                    if(!itemList){
                        return;
                    }

                    itemList.forEach(item => {
                        //console.debug('here '+JSON.stringify(item));
                        var tagNode = new TagNode();
                        tagNode.tag = new Tag();
                        tagNode.tag.id = item.item.id;
                        tagNode.tag.name = item.item.name;
                        tagNode.children = [];
                        //console.debug('tagNote '+JSON.stringify(tagNode));
                        handleChildren(item.children, tagNode.children);
                        //console.debug('tagNote '+JSON.stringify(tagNode));
                        tagList.push(tagNode);
                    });
                }

                if(newValue !== oldValue) {
                    var tagListWithItem = $scope.treeTagProject;
                    var tagList = [];
                    handleChildren($scope.treeTagProject, tagList);
                    tagFactory.save(tagList);
                }
            };
        }]);