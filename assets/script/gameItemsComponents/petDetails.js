
cc.Class({
    extends: cc.Component,
    properties: {
        id:1,
        title:cc.Label,
        iconSF: cc.Sprite,
        detail:cc.Label,
        price: cc.Node,
        energyLabel: cc.Label
    },
    init:function(id){
        let Pet = pet()[id]
        this.id=id;

        let price = getCurrPlayer().calculatePrice(Pet.price)
        this.price.getComponent('price').init(price)
        let energy = getCurrPlayer().calculateEnergyCost(Pet.energy_cost)
        this.energyLabel.string = `${energy}`
        var self = this;
        cc.loader.loadRes(Pet.iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
            if(err) console.log(err);
            self.iconSF.spriteFrame = spriteFrame;
        });
        this.detail.string = Pet.description();
        this.title.string = Pet.pet_name;

    },
    useBtn(){
        let id = this.id
        let locations = getCurrPlayer().Pets.map(item => [item.x, item.y]);
        mapNode().enableSelection(locations, function(x, y) {
            makeOperation(`bp${x}${y}${fillWithZero(id, 2)}`)
            refreshPage()
        })
        cc.find("Canvas/pet").removeFromParent()
        this.node.removeFromParent()
    },
    closeBtn(){
        this.node.removeFromParent();
    },
});

const gameGlobals = require('../battleMiddleWare/gameGlobals');
const { makeOperation } = require('../battleMiddleWare/gameService');
const { getCurrPlayer, pet, constant, mapNode, refreshPage } = require('../battleMiddleWare/gameUtils');
const { fillWithZero } = require('../otherComponents/commonUtils');
