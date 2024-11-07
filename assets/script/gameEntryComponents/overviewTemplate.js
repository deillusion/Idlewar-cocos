cc.Class({
    extends: cc.Component,
    properties: {
        journeyLevel: cc.Label,
        rank1: cc.Label,
        rank2: cc.Label,
        rank3: cc.Label,
        items1: cc.Node,
        items2: cc.Node,
        items3: cc.Node,
        power1: cc.Label,
        power2: cc.Label,
        power3: cc.Label,
        dateLabel: cc.Label,
        itemIcon: cc.Prefab,
        baseInfo: null,
    },
    init(obj) {

        let rankingLabelList = [this.rank1, this.rank2, this.rank3]
        let itemOverviewList = [this.items1, this.items2, this.items3]
        let powerLabelList = [this.power1, this.power2, this.power3]


        let info = obj.info, overviews = obj.overviews

        this.baseInfo = info

        if(info.results && info.results > 0) {
            let rankings = info.results.toString().split("")
            rankings.forEach((rankStr, index) => {
                let rank = parseInt(rankStr)
                let rankLabel = rankingLabelList[index]
                rankLabel.string = ["魁首", "亚圣", "三才"][rank - 1]
            })
        }
        
        overviews.forEach((overview, index) => {
            console.log(overview)
            overview.iconList.filter(itemInfo => {
                return typeDict()[itemInfo.type].overviewDisplay
            }).forEach(itemInfo => {
                let item = cc.instantiate(this.itemIcon)
                item.getComponent('itemOverview').init(itemInfo)
                itemOverviewList[index].addChild(item)
            })
            
            itemOverviewList[index].getComponent(cc.Layout).updateLayout()
            powerLabelList[index].string = convertPowerString(overview.power)
        })

        let passedSecond = Date.now()/1000 - info.startTime
        let passedDay = Math.floor(passedSecond / 86400)
        this.dateLabel.string = `${passedDay}天前`
        this.journeyLevel.string = `${info.level}级福地`
        //console.log(this.node.getComponent(cc.Layout))
        
    },
    entryBtn() {
        let info = this.baseInfo
        //createGame(info.version)
        gameGlobals.gameInfo = info
        gameGlobals.isTrying = true
        gameGlobals.isEntering = false
        journey.getRouter(info.version).initForCocos()

        let needFetchInfo = !info.records || info.records.length == 0
        if (!needFetchInfo) {
            initGame(info.records, info.version)
            cc.director.loadScene('gameMain');
        } else {
            http.sendGetForms(`journey/records/${info.roomid}`, {}, function (response) {
                info.records = response.split("\n")
                initGame(info.records, info.version)
                cc.director.loadScene('gameMain');
            })
        }
    },
});
const { initGame } = require('../battleMiddleWare/gameService');
const http = require('../http');
const gameGlobals = require('../battleMiddleWare/gameGlobals');
const journey = require('../xjfz-journey/index');
const { typeDict, convertPowerString } = require('../battleMiddleWare/gameUtils'); 
const { user } = require('../Globals');