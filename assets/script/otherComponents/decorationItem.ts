// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { DECORATION_MENU } from "../Constants";
import { decoration, user } from "../Globals";
import { sendPostForms } from "../http";
import { danMu } from "./uiUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DecorationItem extends cc.Component {

    @property(cc.Node)
    useBtn: cc.Node = null;

    @property(cc.Node)
    priceLbl: cc.Node = null;

    @property(cc.Node)
    usingLbl: cc.Node = null

    @property(cc.Label)
    nameLbl: cc.Label = null

    @property
    category: string = "";

    @property
    index: number = 1

    item: any = null

    refresh() {
        let item = decoration.find(item => item.category == this.category && item.index == this.index)
        //console.log([this.category, this.index, this.priceLbl, this.useBtn, this.usingLbl])
        let a = [this.priceLbl, this.useBtn, this.usingLbl].forEach(node => node.active = false)
        if(!item) {
            this.priceLbl.active = true
        } else if(item.using == 0) {
            this.useBtn.active = true
        } else {
            this.usingLbl.active = true
        }
        
        this.item = item
    }

    use() {
        let self = this
        sendPostForms("/decoration/switch", this.item, function(response) {
            if(response == "success") {
                decoration.filter(item => item.category == self.category).forEach(item => item.using = 0)
                self.item.using = 1
                cc.find('Canvas').getComponent('decoration').refresh()
            }
        })
    }

    changeIcon() {
        let self = this
        let iconUrl: string
        if(this.index == 0) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/TaptapLoginActivity", "taptapLogin", "()V")
            let fn = () => {
                let o: string = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/TaptapLoginActivity", "getTaptapIcon", "()Ljava/lang/String;")
                if(!o || o.length == 0) {
                    setTimeout(fn, 200)
                    return
                }
                self.sendChangeIconRequest("taptap:" + o)
            }
            setTimeout(fn, 200)
            //iconUrl = "taptap:https://upload-bbs.miyoushe.com/upload/2023/12/14/19325746/66f712552f786570ca16d491d718de2c_375720560896047935.jpg"
        } else {
            //changeXJFZIcon
            iconUrl = DECORATION_MENU.find(item => item.category == this.category && item.index == this.index).url
            this.sendChangeIconRequest(iconUrl)
        }
        
    }

    sendChangeIconRequest(iconUrl) {
        let self = this
        sendPostForms("player/changeIcon", iconUrl, function(response) {
            if(response == "success") {
                decoration.filter(item => item.category == self.category).forEach(item => item.using = 0)
                self.item.using = 1
                user.iconUrl = iconUrl
                cc.find('Canvas').getComponent('decoration').refresh()
            }
        })
    }

    buy() {
        cc.find('Canvas').getComponent('decoration').activeBuyingConfirmation(this.category, this.index, this.nameLbl.string)
    }
    // update (dt) {}
}
