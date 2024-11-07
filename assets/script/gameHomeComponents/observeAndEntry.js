// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


cc.Class({
    extends: cc.Component,

    properties: {
        observedTimesLbl: cc.Label,
        remainTimesLbl: cc.Label,
        page: cc.Node,
        actionType: "",
        commonBtns: cc.Node,
        specialCase: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.zIndex = 201
        if(gameGlobals.isTrying) this.node.active = false
        //this.refresh()
    },

    refresh () {
        //if(gameGlobals.isTrying) this.node.active = false
        this.page.active = false

        let info = gameGlobals.gameInfo[this.actionType]
        let logs = info.logs

        let observed = logs.filter(log => log.active != 0).length
        let total = this.actionType == 'observing' ? 7 : 4
        let remain = total - observed

        let actionName = this.actionType == 'observing' ? "观测" : "修行"

        this.observedTimesLbl.string = `今日已${actionName}：${observed}次`
        this.remainTimesLbl.string = `剩余${actionName}次数：${remain}次`

        this.node.active = info.status != 3 && info.status != 4
        this.commonBtns.active = info.status != 2
        this.specialCase.active = info.status == 2
    },

    adsObserving() {
        let self = this
        let roomid = gameGlobals.gameInfo.roomid
        runAds("", roomid, function(success) {
            if(success) {
                sendGetForms(`journey/room/${roomid}`, {}, function(response) {
                    self.refreshGame(response)
                    self.close()
                })
            }
        })
    },

    gemObserving() {
        this.close()
        let self = this
        let roomid = gameGlobals.gameInfo.roomid
        
        sendPostForms("journey/observe", {roomid}, function(response) {
            //console.log(response)
            //console.log(typeof response)
            self.refreshGame(response)
        })
    },

    entry() {
        this.close()
        let self = this
        let roomid = gameGlobals.gameInfo.roomid
        sendPostForms("journey/entry", {roomid}, function(response) {
            
            self.refreshGame(response)
            gameGlobals.currTime = gameGlobals.gameObj.currTime
            gameGlobals.isTrying = false
            gameGlobals.isEntering = true
        })
    },

    refreshGame(response) {
        initGame(response.split("\n"))
        let minutes = this.actionType == 'observing' ? 30 : 5
        gameGlobals.gameInfo.refreshTime = Date.now() + minutes*60*1000;
        gameGlobals.gameInfo[this.actionType].status = 3
        refreshPage()
        this.page.active = false
    },

    open() {
        this.page.active = true
    },

    close() {
        this.page.active = false
    }
});
const gameGlobals = require("../battleMiddleWare/gameGlobals");
const { runAds } = require('../AnyThinkAds/AdsManager');
const { sendGetForms, sendPostForms } = require("../http");
const { initGame } = require("../battleMiddleWare/gameService");
const { refreshPage } = require("../battleMiddleWare/gameUtils");