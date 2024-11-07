
cc.Class({
    extends: cc.Component,
    properties: {
        nickname:cc.Node,
        icon:cc.Node,

        wealth: cc.Node,
        energy: cc.ProgressBar,
        energyLabel:cc.Label,

        powerLabel: cc.Label,
        growingLabel: cc.Label,
        damageLabel: cc.Label,
        scopeLabel: cc.Label,
        aspdLabel: cc.Label,

        equipList:cc.Node,
        equipItemPrefab: cc.Prefab,

        spellList:cc.Node,
        spellItemPrefab: cc.Prefab,

        buffList: cc.Node,
        buffPrefab: cc.Prefab,
        buffDetail:cc.Node,
        buffDescription: cc.Label,

        content: cc.Node,
        data: null
    },
    init(data){
        this.data = data
        let self = this
        let userInfo = gameGlobals.gameInfo.playerInfo[data.code-1]

        this.nickname.getComponent('twoFontLabel').init(userInfo.nickname, {resizeIfExceed: true})
        this.icon.getComponent('icon').init(userInfo.iconUrl)

        this.powerLabel.string = convertPowerString(data.power)

        this.growingLabel.string = getPercentage(data.grow-1)
        this.damageLabel.string = data.damage
        this.scopeLabel.string = data.scope
        this.aspdLabel.string = data.aspd
        
        COIN_KEYS.forEach((key, index) => {
            let child = self.wealth.children[index]
            let coins = data.coins
            if(!coins[key]) {
                child.active = false
            } else {
                let coin = {}
                coin[key] = coins[key]
                child.getComponent('price').init(coin)
            }
        })

        let max_energy = constant().MAX_ENERGY
        this.energy.progress = data.energy/max_energy
        this.energyLabel.string = `${data.energy}/${max_energy}`
        
        data.equipList.forEach(equip => {
            
            let node = cc.instantiate(self.equipItemPrefab)
            node.getComponent('equipItem').init(typeDict()[equip.type].id)
            resizeNode(node)
            addBlockInputComponent(node)
            self.equipList.addChild(node)

        })
        
        data.spellList.forEach(spell => {
            let clazz = typeDict()[spell.type]
            if(!clazz.uiDisplay) return
            let node = cc.instantiate(self.spellItemPrefab)
            node.getComponent('spellItem').init(clazz.id)
            resizeNode(node)
            addBlockInputComponent(node)
            self.spellList.addChild(node)

        })
        
        let createBuffItem = function(buffItem) {
            let node = cc.instantiate(self.buffPrefab)
            node.getComponent('buffItem').init(buffItem, self.node.getComponent('creatureDetails'))
            self.buffList.addChild(node)
        }

        createBuffItem({type:'geoSign', value: data.geoSign})
        if(data.hydroSign) createBuffItem({type:'hydroSign', value: data.hydroSign})
        if(data.pyroSign) createBuffItem({type:'pyroSign', value: data.pyroSign})

        gameGlobals.gameObj.unitDict.forEach(value => {
            let classOfItem = typeDict()[value.type]
            if(!classOfItem) return
            if(classOfItem.category != 'listener') return
            if(!classOfItem.uiDisplay) return
            if(value.owner.code != data.code) return
            createBuffItem(value)
        })

        setTimeout(()=>{
            let content = self.content
            content.y = 450 - content.height/2
        }, 10)
    },
    viewBuffDescription(content) {
        this.buffDetail.node.active = true
        this.buffDescription.string = content
        let self = this
        setTimeout(() => self.buffDetail.active = false, 10000)
    },
    closeBuffDescription() { 
        this.buffDetail.node.active = false 
    },
    closeBtn:function(){
        this.node.removeFromParent();
    },
});

function resizeNode(node) {
    node.scaleX = 100/node.width
    node.scaleY = 100/node.height
    node.width = 105
    node.height = 105
}

function addBlockInputComponent(node) {
    let blockNode = new cc.Node()
    blockNode.addComponent(cc.BlockInputEvents)
    blockNode.x = node.x
    blockNode.y = node.y
    node.addChild(blockNode)
    
}
const gameGlobals = require('../battleMiddleWare/gameGlobals');
var { typeDict, convertPowerString, refreshPage, constant } = require('../battleMiddleWare/gameUtils');
const { COIN_KEYS } = require('../xjfz-journey/classic-v0.0.1/main/objects/Coin');const { getPercentage } = require('../xjfz-journey/classic-v0.0.1/main/utils/numberUtils');

