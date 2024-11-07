
cc.Class({
    extends: cc.Component,
    properties: {
        list:cc.Layout,
        ownList:cc.Layout,
        deckView:cc.Node,
        item:cc.Prefab,
    },
    start() {
        for(let item of pet()) {
            if(!item.uiDisplay) continue
            let child = initNode(this.item, "petItem", item.id, "detail")
            this.list.node.addChild(child)
        }
        getCurrPlayer().Pets.forEach(pet => {
            let clazz = typeDict()[pet.type]
            let child = initNode(this.item, "petItem", clazz.id, "pet")
            this.ownList.node.addChild(child)
        })
    },
    refresh(){
        
        this.list.node.children.forEach((item) => {
            item.getComponent('petItem').refresh()
        })
    },
    viewDeckBtn() {
        this.ownList.node.active = false
        this.deckView.active = true
    },
    viewPackageBtn() {
        this.deckView.active = false
        this.ownList.node.active = true
    },

    backBtn(){
        this.node.removeFromParent();
    },
});

const { pet, getCurrPlayer, typeDict } = require('../battleMiddleWare/gameUtils');
const { initNode } = require('../otherComponents/uiUtils');

