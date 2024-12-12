// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    val: cc.Label = null;

    //layout: cc.Layout = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(coin: Coin) {
        let type = null;
        COIN_KEYS.forEach(key => {
            if(coin[key]) type = key
        })
        if(!type) {
            this.node.active = false
            return
        }
        this.node.active = true
        //this.layout.node.removeAllChildren()
        let address = `coins/${type}.png`
        let self = this
        cc.loader.loadRes(address, cc.SpriteFrame, function (err, spriteFrame) {
            if(err) console.log(err);
            self.icon.spriteFrame = spriteFrame;
        });
        this.val.string = coin[type]
    }

    // update (dt) {}
}
import { Coin, COIN_KEYS } from '../xjfz-journey/classic-latest/main/objects/Coin'