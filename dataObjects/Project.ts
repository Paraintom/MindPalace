///<reference path="Guid.ts"/>
///<reference path="Serializable.ts"/>
///<reference path="Note.ts"/>
/**
 * Created by Tom on 09/03/2015.
 */

class Project implements Serializable<Project>{
    noteList : Note[]= [] ;
    id : string;
    name:string;
    lastUpdated:number;

    public constructor(){
        this.id = Guid.newGuid();
        this.lastUpdated = 0;
    }

    HasBeenUpdated() {
        this.lastUpdated = new Date().getTime();
    }

    //Used to convert local storage data to project.
    deserialize(input) {
        this.id = input.id;

        for(var index in input.noteList){
            this.noteList.push(new Note().deserialize(input.noteList[index]));
        }
        this.name = input.name;
        if(input.hasOwnProperty('lastUpdated')) {
            this.lastUpdated = input.lastUpdated;
        }
        return this;
    }
}
