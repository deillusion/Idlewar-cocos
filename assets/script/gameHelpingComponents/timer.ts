// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { fillWithZero } from "../otherComponents/commonUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    endTime: number = 0

    callback: Function = null

    isTiming: boolean = false

    startTiming(endTime: number, callback: Function) {
        this.endTime = endTime
        this.callback = callback
        this.isTiming = true
        this.node.active = true
    }

    update () {
        if(!this.isTiming) return
        let currTime = Date.now()
        let remainTime = Math.floor((this.endTime - currTime)/1000)
        if(remainTime < 0) {
            this.isTiming = false
            this.callback()
            this.node.active = false
            return
        }
        let remainMinutes = Math.floor(remainTime/60)
        let remainSeconds = remainTime % 60
        this.label.string = `${remainMinutes}:${fillWithZero(remainSeconds, 2)}`
        if(remainTime < 30) this.label.node.color = cc.Color.RED
    }
}
