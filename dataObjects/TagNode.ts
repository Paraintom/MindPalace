///<reference path="Tag.ts"/>
/**
 * Created by Tom on 01/04/2016.
 */
class TagNode implements Serializable<TagNode> {

    tag:Tag;
    children:TagNode[];

    deserialize(input):TagNode {
        this.tag = input.tag;
        this.children = input.children;
        return this;
    }

}