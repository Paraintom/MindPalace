///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>


angular.module('mindPalaceApp').controller(
    'tagTreeUpdaterController', ['$scope', '$routeParams', 'projectsFactory', 'tagFactory', '$route','$filter','$controller',
        function ($scope, $routeParams, projectsFactory, tagFactory, $route, $filter, $controller) {
            var p : Project= projectsFactory.getProject($routeParams.projectId,$routeParams.projectName);
            //We inherit from the parent (Refactoring)
            $controller('SynchronizeController', {$scope: $scope, $project : p});
            $scope.activeController = 'tagTreeUpdaterController';
            $scope.treeTest =  tagFactory.getAll();
        }]);