
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
            this.list.updateLayout();
            this.list.node.y = 445 - this.list.node.height / 2
        }
        getCurrPlayer().Pets.forEach(pet => {
            let clazz = typeDict()[pet.type]
            let child = initNode(this.item, "petItem", clazz.id, "pet", pet)
            this.ownList.node.addChild(child)
        })
    },
    refresh(){
        getCurrPlayer().Pets.forEach((pet, index) => {
            let clazz = typeDict()[pet.type]
            let child = this.ownList.node.children[index]
            child.getComponent('petItem').init(clazz.id, "pet", pet)
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

