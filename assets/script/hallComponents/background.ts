// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { decoration } from "../Globals";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    character: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //cc.sys.localStorage.setItem("decoration", JSON.stringify({background: 0, character: 0}))
        let background, character
        if (decoration.length > 0) {
            background = decoration.find(item => item.category == 'scene' && item.using == 1).index - 1
            character = decoration.find(item => item.category == 'hero' && item.using == 1).index - 1
        } else {
            let storage = cc.sys.localStorage.getItem("decoration")
            if(!storage) return
            let info = JSON.parse(storage)
            background = info.background
            character = info.character
        }
        cc.sys.localStorage.setItem("decoration", JSON.stringify({background, character}))

        this.character.children.concat(this.background.children).forEach(node => node.active = false)
        this.background.children[background].active = true
        this.character.children[character].active = true
        
    }

    start () {

    }

    // update (dt) {}
}
