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
    content: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {
        let self = this
        http.sendGetForms('public/board', {}, function(response: string){
            self.content.string = response
            completeLoading()
        }) 
    }

    close () {
        this.node.active = false
    }
    // update (dt) {}
}
import http = require('../http')
import { completeLoading } from '../otherComponents/uiUtils';
