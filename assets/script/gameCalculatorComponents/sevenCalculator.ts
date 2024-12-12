// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    resultViews: cc.Node = null;

    @property(cc.Node)
    selectionList: cc.Node = null;

    @property(cc.Node)
    selectionPage: cc.Node = null;

    @property(cc.Prefab)
    selectionItem: cc.Prefab = null;

    @property(cc.Label)
    currItemLabel: cc.Label = null;

    power: number = 7.00000
    level: number = 2

    resultHead = { power: 7.000, level: 2 }
    resultTail = { power: 7.000, level: 2 }

    get resultItems() {
        return this.resultViews.children.slice(1)
    }

    openSelectionPage() { this.selectionPage.active = true }

    closeSelectionPage() { this.selectionPage.active = false }
    
    changeTargetItem(power: number, level: number, name: string) {
        //this.pageNum = 0
        this.currItemLabel.string = name
        this.refreshSingleResultItem(this.resultViews.children[0], {result: "当前修为", power: `${power.toPrecision(5)}e${level}`})
        this.power = power
        this.level = level
        let seven = toSeven(power)
        this.resultTail = {level, power:getPrevSeven(seven)}
        this.nextPage()

    }

    refresh() {
        this.selectionList.removeAllChildren()
        let self = this

        let items = getGameObj().allMapElements
        let players = items.filter(item => item.isPlayer)
        let pets = items.filter(item => !item.isPlayer)
        let axisText = (pet) => `(${pet.x+1},${constant().MAP_SIZE - pet.y})`
        let playerDataList: any[] = players.map(player => {
            let code = player.code
            //console.log(gameGlobals)
            let info = gameGlobals.gameInfo.playerInfo[code-1]
            let name = `${info.nickname}${axisText(player)}`
            let team = code
            return {code, name, team, power:player._power, level: player._level}
        })
        let petDataList = pets.map(pet => {
            let code = pet.code
            let clazz = typeDict()[pet.type]
            let name = `${clazz.pet_name}${axisText(pet)}`
            let team = pet.owner.code
            return {code, name, team, power:pet._power, level: pet._level}
        })
        let itemDataList = playerDataList.concat(petDataList)

        itemDataList.forEach(data => {
            let node = cc.instantiate(this.selectionItem)
            data.callback = () => {
                self.changeTargetItem(data.power, data.level, data.name)
                self.closeSelectionPage()
            }
            node.getComponent("sevenCalSelectItem").init(data)
            this.selectionList.addChild(node)
            this.selectionList.getComponent(cc.Layout).updateLayout()
            this.selectionList.y = 250 - this.selectionList.height / 2
        })

        
        let currPlayer = getCurrPlayer()
        let player = playerDataList.find(player => player.code == currPlayer.code)
        this.changeTargetItem(player.power, player.level, player.name)

    }

    refreshSingleResultItem(item: cc.Node, data) {
        let powerLbl = item.getChildByName("power label").getComponent(cc.Label)
        let resultLbl = item.getChildByName("result label").getComponent(cc.Label)
        powerLbl.string = data.power
        resultLbl.string = data.result
    }

    nextPage() {
        let {power, level} = this.resultTail
        let children = this.resultViews.children
        for(let i = 1; i < children.length; i++) {
            let seven = getNextSeven(power)
            if(power > seven) level++
            power = seven
            let multiple = Math.pow(10, level - this.level)
            let lower = getPercentage(seven*multiple, this.power, false)
            let upper = getPercentage((seven+0.01)*multiple, this.power, true)
            let data = {power: `${seven.toFixed(2)}e${level}`, result:`${lower}~${upper}%`}
            this.refreshSingleResultItem(children[i], data)
            if(i == 1) this.resultHead = {power: seven, level: level}
            if(i == children.length-1) this.resultTail = {power: seven, level: level}
        }
    }

    prevPage() {
        let {power, level} = this.resultHead
        let children = this.resultViews.children
        for(let i = children.length-1; i >= 1; i--) {
            let seven = getPrevSeven(power)
            if(power < seven) level--
            power = seven
            let multiple = Math.pow(10, level - this.level)
            let lower = getPercentage(seven*multiple, this.power, false)
            let upper = getPercentage((seven+0.01)*multiple, this.power, true)
            let data = {power: `${seven.toFixed(2)}e${level}`, result:`${lower}~${upper}%`}
            this.refreshSingleResultItem(children[i], data)
            if(i == 1) this.resultHead = {power: seven, level: level}
            if(i == children.length-1) this.resultTail = {power: seven, level: level}
        }
    }

}
function toSeven(power: number) {
    let rounded = parseFloat(power.toFixed(1))
    if(rounded > power) rounded -= 0.1
    return rounded + 0.07
}

function getPercentage(now: number, old: number, floor: boolean) {
    let ratio = (now/old - 1)
    if(ratio < 0) floor = !floor
    if(floor) ratio -= 0.0005
    else ratio += 0.0005
    let ratioStr = ratio.toFixed(3).replace(".", "")
    ratioStr = parseInt(ratioStr).toString()
    if(!ratioStr.startsWith("-")) ratioStr = "+" + ratioStr
    return ratioStr.substring(0, ratioStr.length-1) + "." + ratioStr.substring(ratioStr.length-1)
}

function getNextSeven(seven: number) {
    let next = seven + 0.1
    if(next > 10) {
        return 1.07
    } else {
        return next
    }
}

function getPrevSeven(seven: number) {
    let prev = seven - 0.1
    if(prev < 1) {
        return 9.97
    } else {
        return prev
    }
}
import gameGlobals = require("../battleMiddleWare/gameGlobals.js")
import { getCurrPlayer, getGameObj, typeDict, constant } from "../battleMiddleWare/gameUtils"
//import BigNumber from 'bignumber';