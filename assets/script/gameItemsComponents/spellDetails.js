
cc.Class({
    extends: cc.Component,
    properties: {
        id:1,
        nameLbl:cc.Label,
        iconSF: cc.Sprite,
        detail:cc.Label,
        price: cc.Node,
        energyLabel: cc.Label,
        _spellDeck: null
    },
    init(id, deckNode){
        //console.log(deckNode)
        this._spellDeck = deckNode
        let player = getCurrPlayer()
        let Spell = spell()[id]
        this.id=id;

        let price = player.getSpellPrice(id)
        let energy = player.calculateEnergyCost(Spell.energy_cost)
        this.price.getComponent('price').init(price)
        this.energyLabel.string = `${energy}`
        var self = this;
        cc.loader.loadRes(Spell.iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
            if(err) console.log(err);
            self.iconSF.spriteFrame = spriteFrame;
        });
        this.detail.string = Spell.description();
        this.nameLbl.string = Spell.spellName;

    },
    useBtn(){
        
        let id = this.id
        let Spell = spell()[id]
        let locations = Spell.validLocations(getCurrPlayer())
        if(!locations) {
            makeOperation(`bs99${fillWithZero(id, 2)}`)
        } else {
            mapNode().enableSelection(locations, function(x, y) {
                makeOperation(`bs${x}${y}${fillWithZero(id, 2)}`)
            })
        }

        this._spellDeck.removeFromParent()
        this.node.removeFromParent()
        //this._spellDeck.active = false
        
        //this.node.active = false
    },
    closeBtn(){
        this.node.removeFromParent();
    },
});

const { makeOperation } = require('../battleMiddleWare/gameService');
const { getCurrPlayer, spell, constant, mapNode } = require('../battleMiddleWare/gameUtils');
const { fillWithZero } = require('../otherComponents/commonUtils');
