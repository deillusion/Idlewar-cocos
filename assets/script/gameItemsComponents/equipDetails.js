
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
        if(data) {
            this.buyLbl.string = "升级"
            price = Equip.upgrade_price
            if( data.level >= constant().EQUIP_MAX_LEVEL ) this.buy.node.active = false
        } else {
            this.buyLbl.string = "购买"
            price = Equip.buy_price
        }
        this.price.getComponent('price').init(getCurrPlayer().calculatePrice(price))
        
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
        if(this.buyLbl.string=="购买"){
            makeOperation(`be00${fillWithZero(this.id, 2)}`)
        } else {
            makeOperation(`ue00${fillWithZero(this.id, 2)}`)
        }
        this.init(this.id)
    },
    closeBtn(){
        this.node.removeFromParent()
    },
});

const { makeOperation } = require('../battleMiddleWare/gameService');
const { getCurrPlayer, equips, constant } = require('../battleMiddleWare/gameUtils');
const { fillWithZero } = require('../otherComponents/commonUtils');
