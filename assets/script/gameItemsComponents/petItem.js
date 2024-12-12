cc.Class({
    extends: cc.Component,

    properties: {
        id:0,
        type: "detail",
        iconSF: cc.Sprite,
        deckDetail: cc.Prefab,
        petDetail: cc.Prefab,
        _data: null
    },
    init:function(id, type, data){
        this.id=id;
        this.type = type
        this._data = data
        var address=pet()[id].iconUrl.replace("pets", "petIcon");
        var self = this;
        cc.loader.loadRes(address, cc.SpriteFrame, function (err, spriteFrame) {
            self.iconSF.spriteFrame = spriteFrame;
        });
    },
    refresh(){
        this.init(this.id)
    },
    seeDetailBtn(){
        if (this.type == "detail"){
            let detail = cc.instantiate(this.deckDetail)
            detail.getComponent('petDetails').init(this.id);
            root().addChild(detail)
        } else {
            let detail = cc.instantiate(this.petDetail)
            detail.getComponent('creatureDetails').init(this._data)
            root().addChild(detail)
        }
    },
});
const { pet } = require("../battleMiddleWare/gameUtils");
const { root } = require("../otherComponents/uiUtils");