// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { journey } from "../Globals";
import { sendGetForms, sendPostForms } from "../http";
import { completeLoading, danMu, loadingView } from "../otherComponents/uiUtils";
//import GameHistory from "./gameHistory";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    games: cc.Prefab = null

    @property(cc.Layout)
    layout: cc.Layout = null

    url: String = "public/tv"

    start(){
        loadingView()
        let self = this
        if (journey.tv) {
            this.refreshRooms();
            completeLoading()
        } else {
            sendGetForms(this.url,{},function(response){
                if(!response || !response.length) {
                    journey.tv = []
                } else {
                    journey.tv = response
                }
                self.refreshRooms();
                completeLoading()
            });

        }
        //this.node.Wo
        
    }

    refreshRooms(){
        var games=this.games;
        var layout=this.layout;
        layout.node.removeAllChildren()
        //console.log('refreshing rooms')
        for(let room of journey.tv){
            var game=cc.instantiate(games);
            game.getComponent('overviewTemplate').init(room);
            game.getComponent(cc.Layout).updateLayout()
            //console.log(game.height)
            
            
            layout.node.addChild(game);
            
        }
        layout.updateLayout()
        
        layout.node.x = layout.node.width/2 - 360
        //console.log('layout y refreshed')
    }

    backBtn(){
        cc.director.loadScene("hall");
    }
    update(dt: number): void {
        this.layout.node.children.forEach(game => {
            game.y = 625 - game.height / 2
        })
    }
}
