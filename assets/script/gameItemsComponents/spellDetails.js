
cc.Class({
    extends: cc.Component,
    properties: {
        id:1,
        nameLbl:cc.Label,
        buyLbl:cc.Label,
        iconSF: cc.Sprite,
        detail:cc.Label,
        price: cc.Node,
        energyLabel: cc.Label,
        commonBottom: cc.Node,
        specialBottom: cc.Node,
        specialConditionLabel: cc.Label,
        _spellDeck: null,
        _mode: 0,
    },
    init(id, deckNode, learned){
        //console.log(deckNode)
        this._spellDeck = deckNode
        this.reset()
        let player = getCurrPlayer()
        let Spell = spell()[id]
        this.id=id;

        let price = player.getSpellPrice(id)
        console.log("price: ", price)
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
        if(learned) {
            this.buyLbl.string = "使用"
            this._mode = 3
        } else if(player.findSpell(id)) {
            if(player.findSpell(id).num > 1e7) {
                this.activateSpecialBottom()
                this.specialConditionLabel.string = "无需炼制"
            } else {
                this.buyLbl.string = "炼制"
                this._mode = 2
            }
        } else {
            let specialUnlockCondition = Spell.specialUnlockCondition(player)
            if(specialUnlockCondition) {
                this.activateSpecialBottom()
                this.specialConditionLabel.string = specialUnlockCondition
            } else {
                this.buyLbl.string = "学习"
            }
            this._mode = 1
        }
    },
    useBtn(){
        let id = this.id

        if(this._mode == 1) {
            let success = makeOperation(`ls99${fillWithZero(id, 2)}`)
            if(success) danMu("学习成功")
            this.init(id, this._spellDeck, false)
            this._refreshDeck()
            return
        } else if(this._mode == 2) {
            let success = makeOperation(`bs99${fillWithZero(id, 2)}`)
            if(success) danMu("开始炼制")
            this._refreshDeck()
            return
        }
        
        let Spell = spell()[id]
        let locations = Spell.validLocations(getCurrPlayer())
        if(!locations) {
            makeOperation(`us99${fillWithZero(id, 2)}`)
        } else {
            mapNode().enableSelection(locations, function(x, y) {
                makeOperation(`us${x}${y}${fillWithZero(id, 2)}`)
            })
        }

        this._spellDeck.removeFromParent()
        this.node.removeFromParent()
        //this._spellDeck.active = false
        
        //this.node.active = false
    },
    reset() {
        this.specialBottom.active = false
        this.commonBottom.active = true
    },
    activateSpecialBottom() {
        this.specialBottom.active = true
        this.commonBottom.active = false
    },
    closeBtn(){
        this.node.removeFromParent();
    },
    _refreshDeck() {
        let spellDeck = this._spellDeck.getComponent("spells")
        spellDeck.refreshLearnSpell()
        spellDeck.refreshUnLearnSpell()
        spellDeck.refreshForgeList()
    }
});

const { makeOperation } = require('../battleMiddleWare/gameService');
const { getCurrPlayer, spell, constant, mapNode } = require('../battleMiddleWare/gameUtils');
const { fillWithZero } = require('../otherComponents/commonUtils');const { danMu } = require('../otherComponents/uiUtils');

