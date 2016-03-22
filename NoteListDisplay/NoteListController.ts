///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Project.ts"/>
///<reference path="../dataObjects/Note.ts"/>
///<reference path="../external/bootbox.d.ts"/>

angular.module('mindPalaceApp').controller(
    'NoteListController', ['$scope', '$routeParams', 'projectsFactory', '$route','$filter','$controller',
        function ($scope, $routeParams, projectsFactory, $route, $filter, $controller) {
            $scope.activeTab =$routeParams.activeTab;
            var p : Project = projectsFactory.getProject($routeParams.projectId);
            //We inherit from the parent (Refactoring)
            $controller('SynchronizeController', {$scope: $scope, $project : p});
            $scope.activeController = 'ListTransactionsController';

            $scope.noteList  = p.noteList;

            var toDelete;
            $scope.deleteTransaction = function(id) {
                for (var index in $scope.transactions) {
                    var currentTransaction = $scope.transactions[index];
                    if (currentTransaction.id == id) {
                        toDelete = currentTransaction;
                        bootbox.confirm({
                            title: 'Delete Transaction?',
                            size: 'small',
                            message: "Are you sure you want to delete the transaction: <b>" + toDelete.comment + "</b>?",
                            callback: function (result) {
                                if (result) {
                                    //$scope.transactions.splice(index, 1);
                                    toDelete.deleted = true;
                                    toDelete.HasBeenUpdated();
                                    projectsFactory.saveProject(p);
                                    $route.reload();
                                }
                            }
                        });
                    }
                }
            }
        }]);