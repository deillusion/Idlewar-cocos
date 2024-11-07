cc.Class({
    extends: cc.Component,
    properties: {
        list:cc.Layout,
        item:cc.Prefab,
    },
    start(){
        let equipList = equips()
        for(let i = 0; i < equipList.length; i++) {
            if(!equipList[i] || !equipList[i].valid) continue
            this.list.node.addChild(initNode(this.item, 'equipItem', i));
        }
    },
    refresh(){
        this.list.node.children.forEach((item) => {
            item.getComponent('equipItem').refresh()
        })
    },

    backBtn(){
        this.node.active=false;
    },
});
let { initNode } = require('../otherComponents/uiUtils');
const { equips } = require("../battleMiddleWare/gameUtils");
