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
export default class GameEntry extends cc.Component {

    @property(cc.Prefab)
    games: cc.Prefab = null

    @property(cc.Layout)
    layout: cc.Layout = null

    @property(cc.Node)
    choose: cc.Node = null

    start(){
        loadingView()
        let self = this
        if (journey.rooms) {
            this.refreshRooms();
            completeLoading()
        } else {
            sendGetForms(`journey/rooms`,{},function(response){
                Object.assign(journey, response)
                if(!journey.rooms) journey.rooms = []
                journey.joined = response.joined
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
        journey.rooms.forEach(room => {
            var game=cc.instantiate(games);
            game.getComponent('entryTemplate').init(room);
            layout.node.addChild(game);
        })
        layout.updateLayout()
        layout.node.y = 750 - layout.node.height / 2
        console.log('layout y refreshed')
    }

    addGameBtn(){
        if(journey.joined) {
            danMu('一天只能开启一场游戏');
        } else {
            this.choose.active=true;
        }
    }

    backBtn(){
        cc.director.loadScene("hall");
    }
}
