
cc.Class({
    extends: cc.Component,
    properties: {
        nickname:cc.Label,
        icon:cc.Sprite,

        miningTypeIcon: cc.Sprite,
        miningTypeSelection: cc.Node,
        miningNumLabel: cc.Label,
        changeMiningTypeBtn: cc.Node,

        powerLabel: cc.Label,
        damageLabel: cc.Label,
        scopeLabel: cc.Label,
        aspdLabel: cc.Label,

        buffList: cc.Node,
        buffPrefab: cc.Prefab,
        buffDetail:cc.Node,
        buffDescription: cc.Label,

        harvest: cc.Node,

        content: cc.Node,

        data: null
    },
    init(data){
        this.data = data

        let self = this
        let clazz = typeDict()[data.type]
        console.log(clazz)
        this.nickname.string = clazz.pet_name

        cc.loader.loadRes(clazz.iconUrl, cc.SpriteFrame, function (err, spriteFrame2) {
            if(err) console.log(err);
            self.icon.spriteFrame = spriteFrame2;
        });

        if(data.owner.code != gameGlobals.currPLayerIndex) this.changeMiningTypeBtn.active = false
        this.initMiningType(data.mining_type)
        this.miningNumLabel.string = `已炼化：${data.mining_num.totalValue()}`

        this.powerLabel.string = convertPowerString(data.power)
        this.damageLabel.string = data.damage
        this.scopeLabel.string = data.scope
        this.aspdLabel.string = data.aspd

        let createBuffItem = function(buffItem) {
            let node = cc.instantiate(self.buffPrefab)
            node.getComponent('buffItem').init(buffItem, self.node.getComponent('creatureDetails'))
            self.buffList.addChild(node)
        }

        createBuffItem({type:'geoSign', value: data.geoSign})
        if(data.hydroSign) createBuffItem({type:'hydroSign', value: data.hydroSign})
        if(data.pyroSign)createBuffItem({type:'pyroSign', value: data.pyroSign})

        gameGlobals.gameObj.unitDict.forEach(value => {
            let classOfItem = typeDict()[value.type]
            if(!classOfItem) return
            if(classOfItem.category != 'listener') return
            if(!classOfItem.uiDisplay) return
            if(value.owner.code != data.code) return
            createBuffItem(value)
        })

        if(data.owner.code != gameGlobals.currPLayerIndex) this.harvest.active = false
        setTimeout(()=>{
            let content = self.content
            content.y = 420 - content.height/2
        }, 10)
        
    },
    initMiningType(mining_type) {
        let index = mining_type? COIN_KEYS.indexOf(mining_type) : 0
        this.setMiningType(index, false)
    },
    setMiningType(index, refresh = true) {
        let selectedType = this.miningTypeSelection.children[0].children[index]
        let selectedSprite = selectedType.getComponent(cc.Sprite).spriteFrame
        this.miningTypeIcon.spriteFrame = selectedSprite
        this.miningTypeSelection.active = false
        if(refresh) {
            let x = this.data.x, y = this.data.y
            makeOperation(`cm${x}${y}0${index}`)
            refreshPage()
        }

    },
    setMiningBaseCoin(){ this.setMiningType(0) },
    setMiningGeoCoin(){ this.setMiningType(1) },
    setMiningAuroCoin(){ this.setMiningType(2) },
    setMiningHydroCoin(){ this.setMiningType(3) },
    setMiningPyroCoin(){ this.setMiningType(4) },
    selectMiningType() { this.miningTypeSelection.active = true},
    cancelSelectMiningType() { this.miningTypeSelection.active = false},
    harvestMining() {
        makeOperation(`hv${this.data.x}${this.data.y}`)
        this.miningNumLabel.string = `已炼化：0`
        refreshPage()
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
const gameGlobals = require('../battleMiddleWare/gameGlobals');
const { makeOperation } = require('../battleMiddleWare/gameService');
var { typeDict, convertPowerString, refreshPage } = require('../battleMiddleWare/gameUtils');
const { COIN_KEYS } = require('../xjfz-journey/classic-v0.0.1/main/objects/Coin');
