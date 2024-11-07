// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { journey } from "../Globals";
import { sendPostForms } from "../http";
import { alertServerError, completeLoading, danMu, loadingView } from "../otherComponents/uiUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    auctions: cc.Node = null

    @property(cc.Node)
    sendConfirmation: cc.Node = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let auctionSetting = cc.sys.localStorage.getItem("auction")
        if(auctionSetting) {
            let arr: any[] = JSON.parse(auctionSetting)
            let children = this.auctions.children
            arr.forEach((item, index) => children[index].getComponent('auction').init(item.pos, item.val))
        }
    }

    closeBtn() {
        this.node.active = false
    }

    sendBtn() {
        this.sendConfirmation.active = true
    }

    cancelSendingBtn() {
        this.sendConfirmation.active = false
    }

    confirmSendingBtn() {
        loadingView()
        let auctions = this.auctions.children.map(node => node.getComponent('auction').readVal())
        console.log(auctions)
        let valid = true

        if(auctions.find(auction => isNaN(auction.val) || auction.val < 0 || auction.val > 100)) {
            valid = false
            alertServerError(new Error("竞拍价必须为小于100的正整数"))
        }

        if(auctions[2].val > auctions[1].val || auctions[1].val > auctions[0].val) {
            valid = false
            alertServerError(new Error("竞拍价必须从高到低"))
        }

        let positions = auctions.map(auction => auction.pos).sort()
        if(positions[0] !=1 || positions[1]!=2 || positions[2]!=3) {
            valid = false
            alertServerError(new Error("竞拍位置不可以相同"))
        }
        let self = this
        if(valid) {
            sendPostForms("journey/join", auctions, function(response) {
                if(response == "success") {
                    danMu("历练行程已安排")
                    journey.joined = true
                    self.node.active = false
                } else {
                }
                completeLoading()
            })
        } else {
            
            completeLoading()
        }
        this.sendConfirmation.active = false
    }
    // update (dt) {}
}
