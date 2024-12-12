cc.Class({
    extends: cc.Component,

    properties: {
        id:0,
        data: null,
        iconSF: cc.Sprite,
        cost:cc.Label,
        detail:cc.Prefab,

        blocking: cc.Node,
        equipName: cc.Node,
        equipNameLabel: cc.Label,
    },

    init:function(data, onlyShow = false){
        
        let id;
        if(typeof data == 'number') {
            id = data
            data = getCurrPlayer().findEquip(id)
        } else {
            id = typeDict()[data.type].id
        }
        
        this.id=id;
        this.data = data
        let Equip = equips()
        var self = this;
        cc.loader.loadRes(Equip[id].iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.iconSF.spriteFrame = spriteFrame;
        });
        this.refresh()
        if(onlyShow) {
            this.blocking.active = true
            this.equipNameLabel.string = typeDict()[data.type].equip_name
        }
    },
    refresh(){
        let player = getCurrPlayer(), data = player.findEquip(this.id)
        //console.log(this.id, player.isForgingEquip(this.id))
        if(data){
            //console.log(this.id, "show data")
            this.cost.node.active=true;
            this.cost.string="Lv."+data.level;
            this.node.zIndex=this.id
        } else if(player.isForgingEquip(this.id)) {
            //console.log(this.id, "show forging")
            this.cost.node.active=true;
            this.cost.string="锻造中";
            this.node.zIndex=this.id
            //setTimeout(()=>console.log(this.node), 1000)
            
        } else {
            this.cost.node.active=false;
            this.cost.string=""
            this.node.zIndex=1000+this.id
        }
    },
    seeDetailBtn(){
        let detail = cc.instantiate(this.detail)
        detail.getComponent('equipDetails').init(this.id);
        root().addChild(detail)
    },
    seeNameBtn(){
        let equipName = this.equipName
        equipName.active = true
        setTimeout(() => equipName.active = false, 10000)
    },
    hideNameBtn() {
        this.equipName.active = false
    }
});
const { checkEquip, equips, typeDict, getCurrPlayer } = require('../battleMiddleWare/gameUtils');
const { root } = require('../otherComponents/uiUtils');
