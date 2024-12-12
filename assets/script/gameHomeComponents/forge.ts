// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Layout)
    list: cc.Layout = null

    @property(cc.Prefab)
    item: cc.Prefab = null;

    init(forgeList: any[]){
        this.list.node.removeAllChildren()
        let self = this
        //let forgeList = getCurrPlayer().forgingList
        let currTime = gameGlobals.currTime
        let aggregated = []
        forgeList.forEach(forge => {
            let item = forge.item, className: string
            if(typeof item == "string") {
                className = item
            } else {
                className = item.type
            }
            let key = `${forge.type}-${className}-${forge.end_time}`
            if(aggregated.find(stat => stat.key == key)) {
                let stat = aggregated.find(stat => stat.key == key)
                stat.list.push(forge)
            } else {
                aggregated.push({key, list: [forge]})
            }
        })
        aggregated.forEach(stat => {
            let forge = stat.list[0]
            let item = forge.item, className
            if(typeof item == "string") {
                className = item
            } else {
                className = item.type
            }
            let clazz = typeDict()[className]
            let node = cc.instantiate(self.item)

            let sprite = node.getChildByName("icon").getComponent(cc.Sprite)
            cc.loader.loadRes(clazz.iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
                if(err) console.log(err);
                sprite.spriteFrame = spriteFrame;
            });

            let remainTime = forge.end_time - currTime
            let seconds = remainTime % 60
            let remainMinutes = (remainTime - seconds) / 60
            let minutes = remainMinutes % 60
            let hours = (remainMinutes - minutes) / 60
            let label = node.getChildByName("time Label").getComponent(cc.Label)
            label.string = `${hours}:${fillWithZero(seconds, 2)}:${fillWithZero(seconds, 2)}`
            
            let size = stat.list.length
            if(size > 1) {
                let countLbl = node.getChildByName("count").getComponent(cc.Label)
                countLbl.node.active = true
                countLbl.string = `${size}x`
            }

            self.list.node.addChild(node)
            self.list.updateLayout()
            self.list.node.x = -315 + self.list.node.width / 2
            console.log(self.list.node)
        })

    }

    close() { this.node.removeFromParent() }
}

import gameGlobals = require("../battleMiddleWare/gameGlobals.js")
import { getCurrPlayer, getGameObj, typeDict, constant } from "../battleMiddleWare/gameUtils"
import { fillWithZero } from "../otherComponents/commonUtils";
