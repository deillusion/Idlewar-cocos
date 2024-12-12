// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RichText)
    content: cc.RichText = null;

    @property(cc.Prefab)
    selfPrefab: cc.Prefab = null;

    @property(cc.Node)
    children: cc.Node = null

    init(log: Log, nodeWidth = 630) {
        let self = this
        this.node.childrenCount
        let content = log.content
        if(log.level == 1) {
            let days = Math.floor(log.time/ONE_JOURNEY_DAY)
            let secondsToday = log.time%ONE_JOURNEY_DAY
            //console.log(secondsToday)
            let startDate = new Date(JOURNEY_START_TIME + secondsToday*1000)
            
            let hours = fillWithZero(startDate.getHours(), 2)
            let minutes = fillWithZero(startDate.getMinutes(), 2)
            let seconds = fillWithZero(startDate.getSeconds(), 2)
            content = `第${days+1}日 ${hours}:${minutes}:${seconds} ` + content
        }
        this.node.width = nodeWidth
        this.children.width = nodeWidth - 60
        this.content.maxWidth = nodeWidth - 30
        if(log.children?.length > 0) {
            this.content.string = `<b>▶${content}</b>`
            log.children.forEach(child => {
                if(child.children?.length > 0) {
                    let childNode = cc.instantiate(self.selfPrefab)
                    childNode.getComponent('historyLog').init(child, nodeWidth - 60)
                    self.children.addChild(childNode)
                } else {
                    let childNode = new cc.Node()
                    let richText = childNode.addComponent(cc.RichText)
                    richText.maxWidth = nodeWidth - 60
                    richText.fontSize = 30
                    richText.lineHeight = 30
                    richText.horizontalAlign = cc.macro.TextAlignment.LEFT
                    richText.string = `<b>${child.content}</b>`
                    childNode.color = new cc.Color(0,0,0,255)
                    self.children.addChild(childNode)
                }
                
            })
        } else {
            this.content.string = `<b>${content}</b>`
            //this.children.removeFromParent()
            //this.getComponent(cc.Layout).
        }
        
        //this.children.active = false
    }

    expand() {
        if(this.children.active) {
            this.content.string = this.content.string.replace('▼','▶')
            this.children.active = false
        } else {
            this.content.string = this.content.string.replace('▶','▼')
            this.children.active = true
        }
    }

    expandAll() {
        this.expand()
        this.children.children.forEach(child => child.getComponent('historyLog')?.expand())
    }

    // update (dt) {}
}

function initRickText(richText: cc.RichText) {

}

function formatLogContent(content: string) {
    let pattern = /\{"code":\d+.*?\}/
    while(content.search(pattern) >= 0) {
        let results = content.match(pattern)
        //console.log('log regex results:', results)
        //if(!results) continue
        results.forEach(result => {
            //console.log('single result: ', result)
            //let data = eval(result)
            
            let data = JSON.parse(result)
            //console.log('single result: ', data)
            let item = gameGlobals.gameObj.unitDict.get(data.code)
            let name: string
            if(data.code <= 3) {
                name = gameGlobals.gameInfo.playerInfo[data.code - 1].nickname
            } else {
                name = typeDict()[item.type].pet_name
            }
            let genStr = name
            if(data.x >= 0) {
                genStr += `(${data.x},${data.y})`
            } else if(data.x == undefined) {
                genStr += `(${item.x},${item.y})`
            }

            let code: number = item.type == 'Player' ? item.code : item.owner.code
            let color = ['', '5e7563','d3b09a','c7a565'][code]
            genStr = `<color=#${color}>${genStr}</c>`
            content = content.replace(result, genStr)
        })
    }
    return content
}



import { typeDict } from '../battleMiddleWare/gameUtils.js';
import gameGlobals = require('../battleMiddleWare/gameGlobals.js')
import { JOURNEY_START_TIME, ONE_JOURNEY_DAY, ONE_NATURAL_DAY } from '../Constants';
import { Log } from "../xjfz-journey/classic-latest/main/loggers/baseLoggers";
import { fillWithZero } from "../otherComponents/commonUtils"