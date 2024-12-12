cc.Class({
    extends: cc.Component,

    properties: {
        id:0,
        iconSF: cc.Sprite,
        detail: cc.Prefab,
        numLbl: cc.Label,
        lockedIcon: cc.Node,
        _deckNode: cc.Node,
        _learned: false,
    },
    init:function(id, deckNode, learned = false){
        //console.log("spell item initing")
        this._deckNode = deckNode
        this.id=id;
        this._learned = learned
        let Spell = spell()[id]
        var self = this;
        cc.loader.loadRes(Spell.iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.iconSF.spriteFrame = spriteFrame;
        });

        let spellObj = getCurrPlayer().findSpell(id)
        if(spellObj && learned && spellObj.num < 1e7) {
            this.numLbl.node.active = true
            this.numLbl.string = spellObj.num
        }
        if(!spellObj) {
            this.lockedIcon.active = true
        }
    },
    refresh(){
        //do nothing
    },
    seeDetailBtn(){
        let detail = cc.instantiate(this.detail)
        detail.getComponent('spellDetails').init(this.id, this._deckNode, this._learned);
        root().addChild(detail)
    },
});

const { spell, getCurrPlayer } = require('../battleMiddleWare/gameUtils');
const { root } = require('../otherComponents/uiUtils');