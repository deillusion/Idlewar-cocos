// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { completeLoading, loadingView } from "./otherComponents/uiUtils";
import { journey } from "./Globals";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    records: cc.Node = null

    @property(cc.Prefab)
    games: cc.Prefab = null

    @property(cc.Node)
    createJourneyPage: cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    /*start () {
        loadingView()
        if(!journey.mock) {
            let rawHistory = cc.sys.localStorage.getItem("mockHistory")
            journey.mock = JSON.parse(rawHistory)
        }
        this.refreshRooms();
        completeLoading()
    }

    refreshRooms(){
        var games=this.games;
        var layout=this.records;
        layout.removeAllChildren()
        //console.log('refreshing rooms')
        for(let room of journey.mock){
            var game=cc.instantiate(games);
            room.isMocking = true
            game.getComponent('overviewTemplate').init(room);
            game.y = 625 - game.height / 2
            layout.addChild(game);
        }
        layout.x = layout.width/2 - 360
        console.log('layout y refreshed')
    }*/

    backToHall() {
        cc.director.loadScene('hall')
    }

    startCreatingJourney(){
        this.createJourneyPage.active = true
    }
}
