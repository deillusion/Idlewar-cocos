
cc.Class({
    extends: cc.Component,
    properties: {
        id:1,
        nameLbl:cc.Label,
        iconSF: cc.Sprite,
        buy:cc.Button,
        buyLbl:cc.Label,
        detail:cc.Label,
        price: cc.Node,
        energyLabel: cc.Label
    },
    init:function(id){
        let data = getCurrPlayer().findEquip(id), price;
        let Equip = equips()[id]
        this.id=id;
        if(data && data.level >= constant().EQUIP_MAX_LEVEL) {
            this.buy.interactable = false
            this.buyLbl.string = "已满级"
        } else if(data) {
            this.buy.interactable = true
            this.buyLbl.string = "升级"
            price = Equip.upgrade_price
        } else if(getCurrPlayer().isForgingEquip(id)) {
            this.buy.interactable = false
            this.buyLbl.string = "锻造中"
        } else {
            this.buy.interactable = true
            this.buyLbl.string = "锻造"
            price = Equip.buy_price
        }
        if(this.buy.interactable) {
            this.price.getComponent('price').init(getCurrPlayer().calculatePrice(price))
        } else {
            this.price.active = false
        }
        
        
        let energy = getCurrPlayer().calculateEnergyCost(Equip.energy_cost)
        
        this.energyLabel.string = `${energy}`
        
        
        var self = this;
        cc.loader.loadRes(Equip.iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
            if(err) console.log(err);
            self.iconSF.spriteFrame = spriteFrame;
        });
        this.detail.string = Equip.description;
        this.nameLbl.string = Equip.equip_name;
        this.cost=false;
    },
    buyBtn(){
        let success= false;
        if(this.buyLbl.string=="锻造"){
            success = makeOperation(`be00${fillWithZero(this.id, 2)}`)
        } else {
            success = makeOperation(`ue00${fillWithZero(this.id, 2)}`)
        }
        if(success) {
            let deckNode = cc.find('Canvas/equip');
            deckNode.getComponent('equips').refresh()
            danMu("开始" + this.buyLbl.string)
        }
        this.init(this.id)
    },
    closeBtn(){
        this.node.removeFromParent()
    },
});

const { makeOperation } = require('../battleMiddleWare/gameService');
const { getCurrPlayer, equips, constant } = require('../battleMiddleWare/gameUtils');
const { fillWithZero } = require('../otherComponents/commonUtils');const { danMu } = require('../otherComponents/uiUtils');
const { Coin } = require('../xjfz-journey/classic-latest/main/objects/Coin');

