// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html



cc.Class({
    extends: cc.Component,

    properties: {
        page: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    refresh () {
        this.node.active = gameGlobals.isEntering && !gameGlobals.isTrying
    },

    submit() {
        this.page.active = true
    },

    cancelSubmit() {
        this.page.active = false
    },

    confirmSubmit() {
        let allOperations = gameGlobals.operations.slice()
        let operations = allOperations.slice(gameGlobals.initPosition)
        console.log(operations)
        sendPostForms("/journey/update", {roomid: gameGlobals.gameInfo.roomid, commands: operations}, function(response) {
            if(response == "success") initGame(allOperations, gameGlobals.gameVersion)
            danMu("提交成功")
        })
        this.page.active = false
    },

    // update (dt) {},
});
const gameGlobals = require("../battleMiddleWare/gameGlobals");
const { initGame } = require("../battleMiddleWare/gameService");
const { sendPostForms } = require("../http");const { danMu } = require("../otherComponents/uiUtils");

