// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { sendGetForms, sendPostForms } from "../http";
import { top } from '../Globals';
import { completeLoading } from "../otherComponents/uiUtils";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    item: cc.Prefab = null;

    @property(cc.Layout)
    list: cc.Layout = null;

    starts: boolean

    pos: number = 1
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let self = this
        let list = this.list
        let init = function(dt) {
            for(var i=0;i<20;i++){
                var player=cc.instantiate(self.item);
                player.getComponent("topTemplate").init(top[i],i+1);
                list.node.addChild(player);
            }
            list.updateLayout();
            list.node.y = (list.node.parent.height - list.node.height) / 2
            self.starts=true;
            completeLoading()
        }
        if(top.length==0){
            sendGetForms("public/top", { interval: 0 }, function(response){ 
                top.push(...response);
                self.scheduleOnce(init,0)
                
            })
        } else {
            this.scheduleOnce(init,0);
        }
        
    }



    backBtn(){
        this.node.active = false
    }
    
    update (dt) {
        if(this.list.node.y>=0&&this.starts&&top.length<=200&&this.pos<10){
            this.starts=false;
            for(var i=0;i<20;i++){
                var player=cc.instantiate(this.item);
                player.getComponent("topTemplate").init(top[20*this.pos+i],20*this.pos+i+1);
                this.list.node.addChild(player);
            }
            console.log("0");
            this.pos++;
            var selfs=this;
            this.list.updateLayout();
            this.list.node.y=-1;
            setTimeout(function(){
                selfs.starts=true;
            },1000);
        }
    }
}
