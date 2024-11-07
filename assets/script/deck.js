cc.Class({
    extends: cc.Component,

    properties: {
        equipView:cc.ScrollView,
        spellView:cc.ScrollView,
    },
    equipBtn(){
        this.equipView.node.active=true;
        this.spellView.node.active=false;
        //this.tradeView.node.active=false;
    },
    spellBtn(){
        this.equipView.node.active=false;
        this.spellView.node.active=true;
        //this.tradeView.node.active=false;
    },
    backBtn(){
        cc.director.loadScene('hall');
    },
});
