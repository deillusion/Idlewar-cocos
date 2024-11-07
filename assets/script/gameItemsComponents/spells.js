
cc.Class({
    extends: cc.Component,
    properties: {
        list:cc.Layout,
        item:cc.Prefab,
    },
    start(){
        let self = this
        spell().forEach(item => {
            if(!item.uiDisplay) return
            self.list.node.addChild(initNode(self.item, 'spellItem', item.id, self.node));
        })
    },
    refresh(){
        //do nothing
    },

    backBtn(){
        this.node.active=false;
    },
});
const { spell } = require('../battleMiddleWare/gameUtils');
const { initNode } = require('../otherComponents/uiUtils');