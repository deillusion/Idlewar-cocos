
cc.Class({
    extends: cc.Component,

    properties: {
        changePlayerNode:cc.Node,
        playerIcon:cc.Sprite,
        currTimeLbl: cc.Label,
        changeTime: cc.Node,
        changeTimeLbl: cc.Label,
        timeSlider: cc.Slider,
        leftBtn: cc.Button,
        rightBtn: cc.Button,
        time: 0
    },
    init() {
        let self = this
        this.changePlayerNode.children.forEach((child, index) => {
            let iconUrl = gameGlobals.gameInfo.playerInfo[index].iconUrl
            child.getComponent("icon").init(iconUrl)
            
        });
        let fn = function() {
            self.changePlayer(gameGlobals.currPLayerIndex)
            if(!self.playerIcon.spriteFrame) setTimeout(fn, 50)
        }
        setTimeout(fn, 50)
    },
    refresh() {
        let pos = gameGlobals.historyPosition
        let leftEnabled = true, rightEnabled = true
        if(pos == 0) leftEnabled = false
        if(gameGlobals.isEntering && pos == gameGlobals.initPosition) leftEnabled = false
        if(pos == gameGlobals.gameRecords.length - 1) rightEnabled = false
        this.leftBtn.enabled = leftEnabled
        this.rightBtn.enabled = rightEnabled
        this.leftBtn.node.color = leftEnabled ? new cc.Color(0,0,0) : new cc.Color(173,173,173)
        this.rightBtn.node.color = rightEnabled ? new cc.Color(0,0,0) : new cc.Color(173,173,173)

        this.time = gameGlobals.gameObj.currTime
        this.currTimeLbl.string = this.refreshTime()
        this.changeTimeLbl.string = this.currTimeLbl.string

        
    },

    left(){
        //console.log('leftMoving')
        moveHistoryPointer(-1)
    },

    right(){
        //console.log('rightMoving')
        moveHistoryPointer(1)
    },

    changePlayerBtn(){
        this.changePlayerNode.active=true;
    },

    changePlayer1(){
        this.changePlayer(1)
    },

    changePlayer2(){
        this.changePlayer(2)
    },

    changePlayer3(){
        this.changePlayer(3)
    },

    changePlayer(index) {
        global.currPLayerIndex=index
        let playerNode = this.changePlayerNode.children[index - 1]
        this.playerIcon.spriteFrame= playerNode.children[0].getComponent(cc.Sprite).spriteFrame ;
        this.changePlayerNode.active=false;
        refreshPage()
        //global.isTrying = true

    },

    addTimeBtn(){
        this.changeTime.active=true;
    },

    refreshTime() {
        const ONE_JOURNEY_DAY = constant().ONE_JOURNEY_DAY
        let time = this.time;
        if(time >= 7 * ONE_JOURNEY_DAY) return `第7日 23:20`
        time = Math.max(0, Math.min(time, ONE_JOURNEY_DAY*7))
        let day = Math.floor(time / ONE_JOURNEY_DAY)
        let clock = new Date(constant().DAILY_START_TIME.valueOf() + time%ONE_JOURNEY_DAY*1000)
        let hours = fillWithZero(clock.getHours(),2), minutes = fillWithZero(clock.getMinutes(),2)
        return `第${day+1}日 ${hours}:${minutes}`    
    },

    changeTimeEvent(){
        this.time = this.timeSlider.progress * constant().ONE_JOURNEY_DAY + global.gameObj.currTime
        this.changeTimeLbl.string = this.refreshTime()       
    },
    plusMinute(){
        if(this.timeSlider.progress >= 1) return
        this.time += constant().ONE_MINUTES;
        this.changeTimeLbl.string = this.refreshTime()       
    },
    minusMinute(){
        if(this.timeSlider.progress <= 0) return
        this.time -= constant().ONE_MINUTES;
        this.changeTimeLbl.string = this.refreshTime()       
    },

    confirmChangingTime(){
        global.currTime = Math.floor(this.time)
        makeOperation('ct')
        this.timeSlider.progress = 0
    },
    cancelChangingTime() {
        this.changeTime.active = false
    },
    confirmEntering(){
        makeOperation('et')
    },

    openSettingPage() {
        console.log(gameGlobals.operations.join("\n"))
        cc.find('Canvas/settings').active = true
    },

    recover(){
        //TODO: 找到history所在的节点让其执行recover
    },

});

const gameGlobals = require('../battleMiddleWare/gameGlobals');
const global = require('../battleMiddleWare/gameGlobals');
const { moveHistoryPointer, getTimePrefix, refreshPage, constant } = require('../battleMiddleWare/gameUtils');
const { makeOperation, copyGame, addHistory } = require('../battleMiddleWare/gameService');
const { fillWithZero } = require('../otherComponents/commonUtils');const { root } = require('../otherComponents/uiUtils');
const { auth } = require('../Globals');

