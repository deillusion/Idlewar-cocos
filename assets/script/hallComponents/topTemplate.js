cc.Class({
    extends: cc.Component,

    properties: {
        rank:cc.Label,
        name1:cc.Label,
        trophic:cc.Label,
        icon: cc.Node,
        userid:""
    },

    init(data,rank){
        this.rank.string=rank+".";
        this.name1.string=data.nickname;
        this.trophic.string=data.trophic;
        this.icon.getComponent('icon').init(data.iconUrl)
        this.userid=data.userid;
    },
    seeDetailBtn(){
        var detail=cc.find("Canvas/userDetail");
        detail.init(this.userid);
        detail.active = true
    },
});
