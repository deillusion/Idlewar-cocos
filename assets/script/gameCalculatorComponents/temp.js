// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html



cc.Class({
    extends: cc.Component,

    properties: {
        player1Icon: cc.Sprite,
        player2Icon: cc.Sprite,
        inkAnimation: cc.Sprite,
        logPrefab: cc.Prefab,
        layout: cc.Node,
        _moved: false,
        _currIndex: 0,
        _layoutHeight: 0,
    },

    refresh() {
        
    },

    sevenPowerList(powerStr) {
        
        let forgeList = getCurrPlayer().forgingList
        forgeList.forEach(forge => {
            let item = forge.item, className
            if(typeof item == "string") {
                className = item
            } else {
                className = item.type
            }
            let clazz = typeDict()[className]
            
        })
    }
});
const { default: Decimal } = require("decimal.js");
const { config, decoration } = require("../Globals");
const gameGlobals = require("../battleMiddleWare/gameGlobals");
const { getPlayerIconUrl, refreshPage, getCurrPlayer, getGameObj, typeDict, constant, pet } = require("../battleMiddleWare/gameUtils");
