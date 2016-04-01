///<reference path="Serializable.ts"/>
/**
 * Created by Tom on 29/03/2016.
 */



class Tag implements Serializable<Tag> {
    id:number;
    name:string;

    constructor() {
        this.id = 0;
        this.name = 'Not set';
    }

    deserialize(input):Tag {
        this.id = input.id;
        this.name =  input.name;
        return this;
    }
}