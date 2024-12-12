cc.Class({
    extends: cc.Component,
    properties: {
        date: cc.Label,
        items: cc.Layout,
        power: cc.Label,
        itemIcon: cc.Prefab,
        historyDate: cc.Label,
        isEnd: false,
        baseInfo: null,
    },
    init(obj) {
        console.log(obj)
        this.baseInfo = obj
        if (!obj.results) {
            let date = Math.floor((new Date().valueOf() / 1000 - obj.startTime) / 86400) + 1;

            let NUM_CN = ["无", "壹", "贰", "叁", "肆", "伍", "陆", "柒"]
            this.date.string = NUM_CN[date];
            this.isEnd = false
        } else {
            let index = [obj.player1id, obj.player2id, obj.player3id].indexOf(user.userid) //obj.playerInfo.findIndex(info => info.userid == user.userid)
            let rank = parseInt(obj.results.toString().charAt(index))
            this.date.string = ["魁首", "亚圣", "三才"][rank - 1]
            this.isEnd = true

            if(this.historyDate) {
                let passedSecond = Date.now()/1000 - obj.startTime
                let passedDay = Math.floor(passedSecond / 86400)
                this.historyDate.string = `${passedDay}天前`
            }
        }

        
        let self = this
        obj.overview.iconList.filter(itemInfo => {
            return typeDict()[itemInfo.type].overviewDisplay
        }).forEach(itemInfo => {
            let item = cc.instantiate(this.itemIcon)
            item.getComponent('itemOverview').init(itemInfo)
            self.items.node.addChild(item)
        })

        this.power.string = convertPowerString(obj.overview.power, 1e6)
    },
    entryBtn() {
        let info = this.baseInfo
        let self = this
        if(!journey.hasVersion(info.version)) {
            danMu("版本过旧，已无法回放")
            return;
        }
        gameGlobals.gameInfo = info
        let needFetchInfo = function () {
            if (!info.records || info.records.length == 0) return true;
            if (info.refreshTime && info.refreshTime < Date.now()) return true
            return false
        }()
        if (!needFetchInfo) {
            initGame(info.records, info.version)
            cc.director.loadScene('gameMain');
        } else {
            http.sendGetForms(`journey/baseinfo/${info.roomid}`, {}, function (response) {
                //console.log(response)
                delete response['overview']
                Object.assign(info, response)
                info.refreshTime = null;
                resetGameGlobals()
                gameGlobals.isTrying = self.isEnd
                journey.getRouter(info.version).initForCocos()
                initGame(response.records, info.version)
                cc.director.loadScene('gameMain');
            })
        }
    },
});
const { initGame, resetGameGlobals } = require('../battleMiddleWare/gameService');
const http = require('../http');
const gameGlobals = require('../battleMiddleWare/gameGlobals');
const journey = require('../xjfz-journey/index');
const { typeDict, convertPowerString } = require('../battleMiddleWare/gameUtils'); 
const { user } = require('../Globals');
const { danMu } = require('../otherComponents/uiUtils');
