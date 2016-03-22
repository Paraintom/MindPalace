///<reference path="Guid.ts"/>
///<reference path="Serializable.ts"/>

/**
 * Created by Tom on 09/03/2015.
 */
class Note implements Serializable<Note>{
    id:string;
    creationTime:number;
    lastUpdated:number;
    title:string;
    content:string;
    labels:number[];

    constructor() {
        //It is a new Note, we WANT it to be synch!!
        var now = new Date().getTime();
        this.creationTime = now;
        this.lastUpdated = now * 2;
        this.labels = [0];
        this.id = Guid.newGuid();
    }

    HasBeenUpdated() {
        this.lastUpdated = new Date().getTime();
    }

    deserialize(input) {
        this.id = input.id;
        //backward compatible mode ...
        this.creationTime = this.extractDate(input.creationTime);
        this.lastUpdated = this.extractDate(input.lastUpdated);
        this.title = input.title;
        this.content = input.content;
        this.labels = input.labels;
        return this;
    }

    private extractDate(inputDate) {
        var result;
        if (inputDate instanceof Date) {
            result = inputDate.getTime();
        }
        else {
            if (inputDate === undefined) {
                result = 1;
            }
            else {
                result = new Date(inputDate).getTime();
            }
        }
        return result;
    }
}