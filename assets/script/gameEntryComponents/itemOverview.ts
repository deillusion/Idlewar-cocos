// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    level: cc.Label = null;

    init(obj) {
        if(obj.level) this.level.string = `lv.${obj.level}`
        let clazz = typeDict()[obj.type]
        let iconUrl = clazz.iconUrl.replace("pets", "petIcon")
        this.node.getComponent("icon").init(`file:${iconUrl}`)
    }

    // update (dt) {}
}

import { typeDict } from '../battleMiddleWare/gameUtils.js';