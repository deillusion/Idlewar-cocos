cc.Class({
    extends: cc.Component,
    properties: {
        lbl:cc.Label,
        _callback: null
    },
    onLoad: function () {
        //cc.game.addPersistRootNode(this.node);
    },

    show(str){
        //console.log("show content:", str)
        if(!str){
            this.lbl.string="错误:网络异常";
        }else if(str == "Failed to fetch") {
            this.lbl.string = "网络无法连接，请检查网络后重新进入游戏"
        }else if(str.length<=200){
            this.lbl.string=str;
        }else{
            this.lbl.string="错误:未知原因";
        }
        this.node.active=true;
    },

    setCallback(fn) {
        //console.log("callback seted")
        this._callBack = fn
    },

    confirmBtn(){
        if(this._callBack) this._callBack()
        this.node.active=false;
    }
}); 