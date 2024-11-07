// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { journey } from "../Globals";
import { sendGetForms, sendPostForms } from "../http";
import { completeLoading, danMu, loadingView } from "../otherComponents/uiUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameHistory extends cc.Component {

    @property(cc.Prefab)
    games: cc.Prefab = null

    @property(cc.Layout)
    layout: cc.Layout = null

    url: String = `journey/history`

    start(){
        loadingView()
        let self = this
        if (journey.pastrooms) {
            this.refreshRooms();
            completeLoading()
        } else {
            sendGetForms(this.url,{},function(response){
                if(!response || !response.length) {
                    journey.pastrooms = []
                } else {
                    journey.pastrooms = response
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
        journey.pastrooms.sort((a, b) => b.startTime - a.startTime)
        journey.pastrooms.forEach(room => {
            var game=cc.instantiate(games);
            game.getComponent('entryTemplate').init(room);
            layout.node.addChild(game);
        })
        layout.updateLayout()
        layout.node.y = 750 - layout.node.height / 2
        console.log('layout y refreshed')
    }

    backBtn(){
        cc.director.loadScene("hall");
    }
}
