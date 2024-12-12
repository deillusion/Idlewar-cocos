cc.Class({
    extends: cc.Component,

    properties: {
        icon: cc.Node,
        nameLbl: cc.Node,
        powerLbl: cc.Label,
        playerPrefab: cc.Prefab,
        code: 0
    },

    init(code) {
        //console.log(code)
        this.code = code
        this.refresh()
    },

    refresh() {
        
        let player = getPlayer(this.code)
        this.powerLbl.string = player.power

        let playerInfo = gameGlobals.gameInfo.playerInfo[this.code - 1]
        this.icon.getComponent("icon").init(playerInfo.iconUrl)
        this.nameLbl.getComponent("twoFontLabel").init(playerInfo.nickname)
    },

    viewPlayerDetail() {
        let node = cc.instantiate(this.playerPrefab)
        node.getComponent('playerDetails').init(getPlayer(this.code))
        root().addChild(node)
    }
    // update (dt) {},
});

const gameGlobals = require("../battleMiddleWare/gameGlobals");
const { convertPowerString, getPlayer } = require("../battleMiddleWare/gameUtils");
const { root } = require("../otherComponents/uiUtils");
