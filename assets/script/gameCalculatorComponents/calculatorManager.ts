// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    sevenCalculator: cc.Node = null;

    @property(cc.Node)
    mathCalculator: cc.Node = null;

    @property(cc.Node)
    sevenBtnLbl: cc.Node = null;

    @property(cc.Node)
    mathBtnLbl: cc.Node = null;

    refresh() {
        this.sevenCalculator.getComponent('sevenCalculator').refresh()
        this.useSevenCalculator()
    }

    useSevenCalculator() {
        this.sevenCalculator.active = true
        this.mathCalculator.active = false

        this.sevenBtnLbl.color = new cc.Color(210, 180, 140)
        this.mathBtnLbl.color = cc.Color.WHITE
    }

    useMathCalculator() {
        this.mathCalculator.active = true
        this.sevenCalculator.active = false

        this.sevenBtnLbl.color = cc.Color.WHITE
        this.mathBtnLbl.color = new cc.Color(210, 180, 140)
    }

    closeBtn() {
        this.node.active = false
    }

    // update (dt) {}
}
