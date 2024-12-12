cc.Class({
    extends: cc.Component,
    properties: {
        list:cc.Layout,
        forgeList:cc.Node,
        item:cc.Prefab
    },
    start(){
        let equipList = equips()
        for(let i = 0; i < equipList.length; i++) {
            if(!equipList[i] || !equipList[i].valid) continue
            this.list.node.addChild(initNode(this.item, 'equipItem', i));
        }

        this.refreshForgeList()
    },
    refresh(){
        console.log("equip refreshing")
        this.list.node.children.forEach((item) => {
            item.getComponent('equipItem').refresh()
        })

        this.refreshForgeList()
    },
    refreshForgeList() {
        let forging = getCurrPlayer().forgingList
            .filter(forge => ["UpgradeEquipListener", "ForgeEquipListener"].includes(forge.type))
        this.forgeList.getComponent("forge").init(forging)
        
    },

    backBtn(){
        this.node.removeFromParent();
    },
});
let { initNode } = require('../otherComponents/uiUtils');
const { equips, getCurrPlayer } = require("../battleMiddleWare/gameUtils");
