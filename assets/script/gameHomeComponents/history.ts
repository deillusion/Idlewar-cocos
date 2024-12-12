// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    logPrefab: cc.Prefab = null

    @property(cc.Node)
    layout: cc.Node = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    
    init() {
        //console.log(gameGlobals.gameObj)
        //gameGlobals.gameObj.logger.console()
        this.layout.removeAllChildren()
        let self = this
        let logs: Log[] = gameGlobals.logs.slice(0,gameGlobals.historyPosition).flat()
        logs.forEach((log) => {
            let logNode = cc.instantiate(self.logPrefab)
            logNode.getComponent('historyLog').init(log)
            self.layout.addChild(logNode)
        })
        setTimeout(()=>this.layout.y = 450 - this.layout.height/2, 10)
        
    }

    closeBtn() {
        this.node.active = false
    }
}

import gameGlobals = require('../battleMiddleWare/gameGlobals.js')
import { Log } from '../xjfz-journey/classic-latest/main/loggers/baseLoggers.js';
