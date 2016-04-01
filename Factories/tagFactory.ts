///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/TagNode.ts"/>


var tagFactory = angular.module('tagFactory', ['ngResource']);

tagFactory.factory('tagFactory', function () {

    var localStorageKey = "tagTree";
    var separator = "░";
    var allTags: TagNode[] = [];
    init();

    function getFakeNodeTag(i : number) : TagNode {
        var result = new Tag();
        result.id = i;
        result.name = "b;la"+i;
        var nodeResult = new TagNode();
        nodeResult.item = result;
        nodeResult.children = [];
        return nodeResult;
    }

    function init(){
        try {
            var tagsListString = localStorage.getItem(localStorageKey);
            if(tagsListString === null){
                var rootTag = new Tag();
                rootTag.name = "Default Tag";
                var rootNode = new TagNode();
                rootNode.item = rootTag;
                rootNode.children = [];
                allTags = [rootNode];
                var firstNode = getFakeNodeTag(1)
                rootNode.children.push(firstNode);
                rootNode.children.push(getFakeNodeTag(2));
                rootNode.children.push(getFakeNodeTag(3));
                firstNode.children.push(getFakeNodeTag(4));
                firstNode.children.push(getFakeNodeTag(5));
            }
            else{
                var tagList = tagsListString.split(separator);
                for (var i = 0; i < tagList.length; i++) {
                    var tagJSon = JSON.parse(tagList[i]);
                    var tag = new TagNode().deserialize(tagJSon);
                    allTags.push(tag);
                }
            }
        } catch (error) {
            this.console.error("LocalStorageService::tagFactory::init: can't retrieve the tree of tags. Error: " + error);
        }
    }

    return {
        getAll: function () : TagNode[] {
            return allTags;
        },
        save: function (tagList : TagNode[]) {
            allTags = tagList;
            localStorage.setItem(localStorageKey, JSON.stringify(tagList));
        }
    }
});