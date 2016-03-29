///<reference path="../external/linq.d.ts"/>
///<reference path="../external/angular.d.ts"/>
///<reference path="../dataObjects/Tag.ts"/>


var tagFactory = angular.module('tagFactory', ['ngResource']);

tagFactory.factory('tagFactory', function () {

    var localStorageKey = "tagTree";
    var separator = "░";
    var allTags: Tag[] = [];
    init();

    function addFakeTag(i : number, parent : number) : Tag {
        var result = new Tag();
        result.id = i;
        result.parent = parent;
        result.name = "b;la"+i;
        return result;
    }

    function init(){
        try {
            var tagsListString = localStorage.getItem(localStorageKey);
            if(tagsListString === null){
                var rootTag = new Tag();
                rootTag.name = "Default Tag";
                rootTag.parent = -1;
                allTags = [rootTag];
                allTags.push(addFakeTag(1,0));
                allTags.push(addFakeTag(2,0));
                allTags.push(addFakeTag(3,0));
                allTags.push(addFakeTag(4,1));
                allTags.push(addFakeTag(5,1));
            }
            else{
                var tagList = tagsListString.split(separator);
                for (var i = 0; i < tagList.length; i++) {
                    var tagJSon = JSON.parse(tagList[i]);
                    var tag = new Tag().deserialize(tagJSon);
                    allTags.push(tag);
                }
            }
        } catch (error) {
            this.console.error("LocalStorageService::tagFactory::init: can't retrieve the tree of tags. Error: " + error);
        }
    }

    return {
        getAll: function () {
            return allTags;
        },
        add: function (tag : Tag) {
            allTags.push(tag);
            localStorage.setItem(localStorageKey, allTags.join(separator));
        },
        delete: function (tag : Tag) {
            var index = allTags.indexOf(tag);
            if(index != -1) {
                allTags.splice(index, 1);
                localStorage.setItem(localStorageKey, allTags.join(separator));
            }
        }
    }
});