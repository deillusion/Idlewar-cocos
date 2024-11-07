cc.Class({
    extends: cc.Component,

    properties: {
        id:0,
        iconSF: cc.Sprite,
        detail: cc.Prefab,
        _deckNode: cc.Node
    },
    init:function(id, deckNode){
        this._deckNode = deckNode
        this.id=id;
        let Spell = spell()[id]
        var self = this;
        cc.loader.loadRes(Spell.iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.iconSF.spriteFrame = spriteFrame;
        });
        this.refresh()
    },
    refresh(){
        //do nothing
    },
    seeDetailBtn(){
        let detail = cc.instantiate(this.detail)
        detail.getComponent('spellDetails').init(this.id, this._deckNode);
        root().addChild(detail)
    },
});

const { spell } = require('../battleMiddleWare/gameUtils');
const { root } = require('../otherComponents/uiUtils');