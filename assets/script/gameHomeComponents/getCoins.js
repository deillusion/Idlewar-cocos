const gameGlobals = require('../battleMiddleWare/gameGlobals');
const { makeOperation } = require('../battleMiddleWare/gameService');
const { refreshPage } = require('../battleMiddleWare/gameUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        lasttimeStr:cc.Label,
    },

    init(){
        var date=new Date();
        var lasttime=new Date(gameGlobals.currTime);
        console.log(lasttime);
        var timeStr='上次登录时间：\n';
        if(date.getDate()==lasttime.getDate()){
            timeStr+="今天";
        }else if(date.getDate()-1==lasttime.getDate()){
            timeStr+="昨天";
        }else{
            timeStr+="几天前";
        }
        timeStr+=lasttime.getHours()+":"+lasttime.getMinutes();
        this.lasttimeStr.string=timeStr;
    },
    useAd(){
        //广告sdk
        this.entry('a');
    },
    useGem(){
        //检查钻石是否够用
        //TODO:最好在init的时候就显示钻石的消耗
        this.entry('g')
    },
    observe(type) {
        http.sendPostForms("observe", {roomid: gameGlobals.roomid, type: type, version: gameGlobals.gameInfo.records.length}, function(response){
            makeOperation(response.operations)
            refreshPage()
            if (JSON.stringify(gameObj) != JSON.stringify(response.obj)) {
                console.log(JSON.stringify(gameObj))
                console.log(JSON.stringify(response.obj))
            }
        })
    },
    entry(){
        var self=this;
    },
    closeBtn(){
        this.node.active=false;
    },
});

