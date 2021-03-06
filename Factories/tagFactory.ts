///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/TagNode.ts"/>


var tagFactory = angular.module('tagFactory', ['ngResource']);

tagFactory.factory('tagFactory', function () {

    var localStorageKey = "tagTree";
    var maxId : number = 0;
    var allTags: TagNode[] = [];
    init();

    function getFakeNodeTag(i : number) : TagNode {
        var result = new Tag();
        result.id = i;
        result.name = "b;la"+i;
        var nodeResult = new TagNode();
        nodeResult.tag = result;
        nodeResult.children = [];
        return nodeResult;
    }

    function calculateMaxId():void {
        var explorerNodeId = function (node : TagNode) {
            var currentId = node.tag.id;
            if(node.children) {
                for (var j = 0; j < node.children.length; j++) {
                    var children = node.children[j];
                    explorerNodeId(children);
                }
            }
            if(currentId > maxId){
                maxId = currentId;
            }
        };
        for (var i = 0; i < allTags.length; i++) {
            var currentTagNode = allTags[i];
            explorerNodeId(currentTagNode);
        }
        //alert('maxId = '+maxId);
    }

    function init(stop){
        try {
            console.debug("Reading tags...");
            var tagsListString = localStorage.getItem(localStorageKey);
            if(tagsListString === null){
                var rootTag = new Tag();
                rootTag.name = "Default Tag";
                var rootNode = new TagNode();
                rootNode.tag = rootTag;
                rootNode.children = [];
                allTags = [rootNode];
            }
            else{
                //console.debug(tagsListString);
                var tagList = JSON.parse(tagsListString);
                //console.debug(tagList[0].tag);
                if(tagList[0].tag.id === undefined){
                    throw new Error("Id cannot be read!");
                }
                allTags = tagList;
            }
            calculateMaxId();
        } catch (error) {
            this.console.error("LocalStorageService::tagFactory::init: can't retrieve the tree of tags. Error: " + error);
            //TODO REMOVE THIS CLEANUP WHEN STABLE!
            if(!stop){
                localStorage.removeItem(localStorageKey);
                init(true);
            }
        }
    }

    return {
        getDefaultTag: function () : Tag {
            var result = Enumerable.from<TagNode>(this.getAll()).where(o=> o.tag.id == 0).firstOrDefault();
            return result.tag;
        },
        getAll: function () : TagNode[] {
            return allTags;
        },
        getNewTag: function (label : string) : Tag {
            var newTag = new Tag();
            newTag.name = label;
            newTag.id = maxId+1;
            maxId++;

            var tagNode = new TagNode();
            tagNode.children = [];
            tagNode.tag = newTag;
            allTags.push(tagNode);
            this.save(allTags)
            return newTag;
        },
        save: function (tagList : TagNode[]) {
            allTags = tagList;
            var toSave = JSON.stringify(tagList);
            localStorage.setItem(localStorageKey, toSave);
            //console.debug("save has been called"+toSave);
        }
    }
});