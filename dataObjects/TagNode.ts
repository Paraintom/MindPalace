///<reference path="Tag.ts"/>
/**
 * Created by Tom on 01/04/2016.
 */
class TagNode implements Serializable<TagNode> {

    item:Tag;
    children:TagNode[];

    deserialize(input):TagNode {
        this.item = input.item;
        this.children = input.children;
        return this;
    }

}