// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { runAds } from "./AnyThinkAds/AdsManager";
import { DECORATION_MENU } from "./Constants";
import { decoration, user } from "./Globals";
import { sendGetForms, sendPostForms } from "./http";
import { danMu, loadingView } from "./otherComponents/uiUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Decoration extends cc.Component {

    @property(cc.Layout)
    userIcon: cc.Layout = null;

    @property(cc.Layout)
    journeyIcon: cc.Layout = null;

    @property(cc.Layout)
    hero: cc.Layout = null;

    @property(cc.Layout)
    scene: cc.Layout = null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    addGem: cc.Node = null

    @property(cc.Label)
    gemLbl: cc.Label = null

    @property(cc.Node)
    confirmBuyingNode: cc.Node = null

    @property(cc.Label)
    confirmBuyingLabel: cc.Label = null

    itemWantToBuy: {category: string, index: number} = null

    

    onLoad () {
        if(decoration.length <= 1) {
            let self = this
            sendGetForms('decoration/menu', {}, function(response: any[]) {
                decoration.push(...response)
                //decoration.push()
                self.refresh()
            })
        } else {
            this.refresh()
        }
        
        
        this.gemLbl.string = `${user.gems}`
    }

    refresh() {
        let nodeLists = [this.userIcon, this.journeyIcon, this.hero, this.scene].map(layout => layout.node.children)
        let nodes: cc.Node[] = [].concat(...nodeLists)
        nodes.forEach(node => {
            //console.log(node)
            node.getComponent('decorationItem').refresh()
        })
        this.gemLbl.string = `${user.gems}`
    }

    activeAddGemPage() {
        this.addGem.active = true
    }

    closeAddGemPage() {
        this.addGem.active = false
    }

    viewAds() {
        //let res: string = jsb.reflection.callStaticMethod("TODO:", "TODO:", "(TODO:)Ljava/lang/String;", "TODO:")
        //loadingView()
        let self = this
        runAds("addGem", user.userid.toString(), function(res: boolean) {
            if(res) {
                user.gems += 10
                self.gemLbl.string = `${user.gems}`
                danMu("获得10钻石")
            }
            self.closeAddGemPage()
        })
        
    }

    activeBuyingConfirmation(category: string, index: number, itemName: string) {
        this.itemWantToBuy = {category, index}
        this.confirmBuyingLabel.string = `确定要购买${itemName}吗?`
        this.confirmBuyingNode.active = true

    }

    confirmBuying() {
        let self = this
        this.confirmBuyingNode.active = false
        
        sendPostForms("decoration/buy", this.itemWantToBuy, function(response) {
            if(response && response.length > 0) {
                //let item = decoration.find(item => item.category == response.category && item.index == response.index)
                //item.userid = user.userid
                decoration.push(...response)
                danMu("购买成功")
                let {category, index} = self.itemWantToBuy
                let item = DECORATION_MENU.find(item => item.category == category && item.index == index)
                if(item) user.gems -= item.price
                self.refresh()
            }
        })
    }

    cancelBuying() {
        this.confirmBuyingNode.active = false
    }

    backToHall() {
        cc.director.loadScene('hall')
    }

    // update (dt) {}
}
