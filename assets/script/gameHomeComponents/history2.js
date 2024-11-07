const { gameRecords } = require("../battleMiddleWare/gameGlobals");
const gameGlobals = require("../battleMiddleWare/gameGlobals");
const TRY_COLOR = cc.Color.GRAY
const OPERATION_COLOR = cc.Color.GREEN
const HISTORY_COLOR = cc.Color.WHITE
const MAIN_OUTLINE_COLOR = cc.Color.BLACK
const COMMON_OUTLINE_COLOR = cc.Color.GRAY
cc.Class({
    extends: cc.Component,
    //尚未完成
    properties: {
        container:cc.Layout,
        label:cc.Prefab,
        dayList:[]
    },
    
    onLoad () {
        self = this
        gameGlobals.gameObj.logger.forEach(instru => {
            self.container.node.addChild(log_label(instru));
        })
    },

    refresh() {
        if(this.container.children.length < infoList.length){
            for(let i = this.container.children.length; i < infoList.length; i++) {
                let node = gameGlobals.isTrying ? try_label(infoList[i]) : additional_label(infoList[i])
                this.container.node.addChild(node);
            }
        } else {
            for(let i = this.container.children.length - 1; i >= infoList.length; i--) {
                this.container.node.removeChild(this.container.children[i]);
            }
        }
    },

    recover(){
        for(let i = this.container.children.length - 1; i >= 0; i--) {
            let node = this.container.children[i]
            if (node.color == TRY_COLOR) {
                if (node.getComponent('Label').getComponent('LabelOutline').color == MAIN_OUTLINE_COLOR) {
                    gameRecords.pop()
                    gameGlobals.historyPosition--
                    let oldObj = gameRecords[gameGlobals.historyPosition]
                    gameGlobals.gameObj = JSON.parse(JSON.stringify(oldObj))
                }
                this.container.node.removeChild(node)
            }
        }
        gameGlobals.isTrying = false
    },

    closeBtn(){
        this.node.active=false;
    },
});

var log_label = function(instru) {
    return create_label(HISTORY_COLOR, instru)
}

var additional_label = function(instru) {
    return create_label(OPERATION_COLOR, instru)
}

var try_label = function(instru) {
    return create_label(TRY_COLOR, instru)
}

var create_label = function(label_color, instru){
    var node = new cc.Node("123");
    node.width=500;
    node.height=50;
    var label = node.addComponent(cc.Label);
    label.overflow=3;
    label.fontSize=40;
    label.lineHeight=40;
    label.horizontalAlign=0;
    node.color = label_color;
    if(instru.startsWith('o')) {
        instru = instru.substr(1)
        outline_color = MAIN_OUTLINE_COLOR
    } else {
        outline_color = COMMON_OUTLINE_COLOR
    }
    var outline = label.addComponent(cc.LabelOutline);
    outline.color = outline_color;
    outline.width=3;
    label.string=instru;
    return node
}

module.exports={create_label:log_label}