// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    auctionValue: cc.EditBox = null

    @property(cc.Label)
    auctionPosition: cc.Label = null;

    @property(cc.Sprite)
    auctionPositionColor: cc.Sprite = null

    @property(cc.Node)
    auctionPositionSelection: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(index: number, val: number) {
        this.auctionValue.string = `${val}`
        this.setAuctionPosition(index)
    }

    setAuctionPosition(index: number) {
        this.auctionPosition.string = ["一号位","二号位","三号位"][index]
        let position = this.auctionPositionSelection.children[index]
        this.auctionPositionColor.spriteFrame = position.getComponent(cc.Sprite).spriteFrame
        this.auctionPositionSelection.active = false
    }

    enableAuctionPositionSelection() {
        this.auctionPositionSelection.active = true
    }

    readVal() {
        let valString = this.auctionValue.string ? this.auctionValue.string : "0"
        let val = parseInt(valString.trim())
        let pos = ["一号位","二号位","三号位"].indexOf(this.auctionPosition.string) + 1
        return {val:val,pos:pos}
    }

    auction1st() { this.setAuctionPosition(0) }
    auction2nd() { this.setAuctionPosition(1) }
    auction3rd() { this.setAuctionPosition(2) }
    // update (dt) {}
}
