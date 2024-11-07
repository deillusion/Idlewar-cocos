const { buff } = require("../battleMiddleWare/gameUtils");

cc.Class({
    extends: cc.Component,
    properties: {
        intro:cc.Label,
        remain:cc.Label
    },
    init(data){
        let deck = buff()
        var str=deck[data.id].intro;
        if(deck[data.id].intro2){
            str+=data.value+deck[data.id].intro2;
        }
        this.intro.string=str;
        var now=data.duration-new Date().valueOf()+data.date;
        var timeStr='剩余时间';
        if(now>=3600000){
            timeStr+=Math.floor(now/3600000)+'小时';
            now-=Math.floor(now/3600000)*3600000;
        }
        timeStr+=Math.floor(now/60000)+'分';
        this.remain.string=timeStr;
    },
});