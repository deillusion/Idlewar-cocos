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
    teamLabel: cc.Label = null;

    @property(cc.Sprite)
    teamTexture: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null
    
    power: string = null;

    callback: Function = null;

    init(data) {
        this.nameLabel.string = data.name

        let self = this
        let code = data.team
        this.teamLabel.string = ["一","二","三"][code - 1]
        cc.loader.loadRes(`texture/${code}.png`, cc.SpriteFrame, function (err, spriteFrame) {
            if(err) console.log(err);
            self.teamTexture.spriteFrame = spriteFrame;
        });

        this.callback = data.callback
        this.power = data.power
    }

    changeTargetItem() { this.callback() }

    // update (dt) {}
}
