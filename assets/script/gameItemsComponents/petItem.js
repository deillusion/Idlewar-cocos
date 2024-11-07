cc.Class({
    extends: cc.Component,

    properties: {
        id:0,
        type: "detail",
        iconSF: cc.Sprite,
        detail: cc.Prefab
    },
    init:function(id, type){
        this.id=id;
        this.type = type
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
            let detail = cc.instantiate(this.detail)
            detail.getComponent('petDetails').init(this.id);
            root().addChild(detail)
        } else {
            let detail = cc.instantiate(this.detail)
        }
    },
});
const { pet } = require("../battleMiddleWare/gameUtils");
const { root } = require("../otherComponents/uiUtils");