
const global = require('./gameGlobals')
const { getEquip, getSpell, getPets, getBuffs } = require('../xjfz-journey/index')
const { DECORATION_MENU } = require('../Constants')
const obj = {
    constant: function(){ return global.gameModule.constants },
    equips: function(){ return getEquip(global.gameVersion) },
    spell: function(){ return getSpell(global.gameVersion) },
    pet: function(){ return getPets(global.gameVersion) },
    buff: function(){ return getBuffs(global.gameVersion) },
    typeDict: function() { return global.gameModule.typeDict.typeDict },

    getPlayer:function(i) {
        return global.gameObj.getPlayer(i)
    },

    getCurrPlayer:function() {
        return global.gameObj.getPlayer(global.currPLayerIndex)
    },

    getTimePrefix:function() {
        let currTime = global.currTime? global.currTime : Math.floor(new Date().valueOf()/1000)
        let startTime = global.gameObj.startdate;
        return currTime-startTime
    },
    /**
     * 检查当前角色中是否包含该武器
     * @param {number} id 
     */
    checkEquip:function(id) {
        let list = obj.getCurrPlayer().equipList;
        return list.find(item => item.id==id)
    },
    /**
     * 将id转为两位数的string
     * @param {number} id 
     * @returns 
     */
    idString:function(id) {
        return id < 10 ? "0" + id : "" + id
    },
    convertPowerString(power, MAX_NUM_VALUE = 1e8) {
        if(parseFloat(power) < MAX_NUM_VALUE) {
            //console.log(parseFloat(power))
            power = `${parseFloat(power).toFixed(2)}`
            
            if(power.endsWith('00')) power = power.replace('.00', '')
            else if(power.endsWith('0')) power = power.substring(0, power.length - 1)
        }
        return power
    },
    /** 根据global中的数据刷新页面上的数据 */
    refreshPage:function() {
        //global.currTime = global.gameObj.currTime
        //global.currPLayerIndex = global.gameObj.currUser.code
        cc.find('Canvas').getComponent('gameMain').refresh()
    },
    mapNode: function() {
        return cc.find('Canvas/Map').getComponent('map')
    },
    moveHistoryPointer:function(step) {
        let newPosition = global.historyPosition + step
        if(newPosition > 0 && newPosition < global.gameRecords.length){
            global.historyPosition = newPosition
            global.gameObj = global.gameRecords[newPosition]
            global.currTime = global.gameObj.currTime
            obj.refreshPage()
        }
    },
    getPlayerIconUrl:function(code, category = 'player') {
        let decoration = global.gameInfo.playerInfo[code - 1].decorations
        let skin = decoration.find(item => item.category == 'player' && item.using == 1)
        //console.log(skin)
        let skinId = skin ? skin.index : 4
        let skinInfo = DECORATION_MENU.find(item => item.category == category && item.index == skinId)
        return skinInfo.url.split(":")[1]
    },
}

module.exports = obj