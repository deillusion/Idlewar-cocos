// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { foreigners, user } from "../Globals";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    nickname: cc.Label = null;

    @property(cc.Label)
    uid: cc.Label = null;

    @property(cc.Label)
    trophy: cc.Label = null;

    @property(cc.Label)
    maxTrophy: cc.Label = null;

    @property(cc.Label)
    enrollDate: cc.Label = null;

    @property(cc.Label)
    learningRate: cc.Label = null;

    @property(cc.Label)
    gameTimes: cc.Label = null;

    @property(cc.Label)
    winRate: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(userid) {
        if(userid == user.userid) {
            this.setProperties(user)
        } else if(foreigners[userid]){
            this.setProperties(foreigners[userid])
        } else {

        }
    }

    setProperties(info) {
        this.nickname.string = info.nickname
        this.uid.string = `UID:${info.userid}`
        this.trophy.string = info.trophic
        this.maxTrophy.string = info.maxTrophic
        this.enrollDate.string = info.enrolledDate
        this.learningRate.string = info.learningRate
        this.gameTimes.string = info.game_times
        this.winRate.string = getPercentage(info.win_times/info.game_times)
        
    }

    closeBtn() {
        this.node.removeFromParent()
    }

    // update (dt) {}
}

function getPercentage(num) {
    //console.log(num)
    num *= 10000
    let numStr = Math.round(num).toString()
    //console.log(numStr)
    let floatDigit = 2
    if(numStr.endsWith('0')) floatDigit = 1
    if(numStr.endsWith('00')) floatDigit = 0
    let index = numStr.length - 2
    let res = numStr.substring(0, index)
    if(floatDigit > 0) {
        
        res += `.${numStr.substring(index, index + floatDigit)}`
    }
    return res + '%'
}