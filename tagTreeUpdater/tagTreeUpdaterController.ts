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
            $scope.treeTest =  tagFactory.getAll();
            $scope.$watchCollection('treeTest', onTreeChanged);

            function onTreeChanged(newValue, oldValue){
                function handleChildren(itemList, tagList) {
                    if(!itemList){
                        return;
                    }

                    itemList.forEach(item => {
                        console.debug('here '+JSON.stringify(item));
                        var tagNode = new TagNode();
                        tagNode.tag = new Tag();
                        tagNode.tag.id = item.item.id;
                        tagNode.tag.name = item.item.name;
                        tagNode.children = [];
                        console.debug('tagNote '+JSON.stringify(tagNode));
                        handleChildren(item.children, tagNode.children);
                        console.debug('tagNote '+JSON.stringify(tagNode));
                        tagList.push(tagNode);
                    });
                }

                if(newValue !== oldValue) {
                    var tagListWithItem = $scope.treeTest;
                    var tagList = [];
                    handleChildren($scope.treeTest, tagList);
                    tagFactory.save(tagList);
                }
            };
        }]);