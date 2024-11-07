var http=require('../http');
cc.Class({
    extends: cc.Component,

    properties: {
        roomid:"",
        time:cc.Label,
        player1:cc.Label,
        trophic1:cc.Label,
        player2:cc.Label,
        trophic2:cc.Label,
        player3:cc.Label,
        trophic3:cc.Label,
        alert:cc.Prefab
    },
    init(data){   
        this.roomid=data.roomid;
        var time=new Date(this.time);
        this.time.string="创建时间："+(time.getMonth()+1)+"月"+(time.getDate())+"日";
        this.player1.string=data.player1;
        this.trophic1.string=data.trophic1;
        this.player2.string=data.player2;
        this.trophic2.string=data.trophic2;
        this.player3.string=data.player3;
        this.trophic3.string=data.trophic3;
        this.scheduleOnce((dt)=>{
            if(this.player1.node.width<=500){
                this.player1.node.x=-250+this.player1.node.width/2
            }else{
                this.player1.node.scaleX=500/this.player1.node.width;
                this.player1.node.scaleY=500/this.player1.node.width;
            }
        },0);
    },
    entry(){
        var roomid=this.roomid;
        http.sendPostForms("entrygame/load",{},function(response){
            cc.director.loadScene('mainGame');
        })
    }
});