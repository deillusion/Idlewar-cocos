
cc.Class({
    extends: cc.Component,
    properties: {
        list:cc.Layout,
        item:cc.Prefab,
        forgeList:cc.Node,
    },
    start(){
        this.refreshLearnSpell()
    },
    _refresh(include){
        this.node.removeAllChildren()
        let player = getCurrPlayer()
        let self = this
        spell().forEach(item => {
            if(!item.uiDisplay) return
            let learned = player.findSpell(player)
            if(!include && learned) return
            if(include && !learned) return
            self.list.node.addChild(initNode(self.item, 'spellItem', item.id, self.node));
        })
    },
    refreshForgeList() {
        let forging = getCurrPlayer().forgingList
            .filter(forge => ["ForgeSpellListener"].includes(forge.type))
        this.forgeList.getComponent("forge").init(forging)
    },

    refreshLearnSpell() {
        //console.log("refreshing learn spell")
        this.list.node.removeAllChildren()
        //console.log("removing children")
        let self = this, list = this.list
        let player = getCurrPlayer()
        //console.log("getting curr player")
        let spellList = spell().filter(clazz => player.findSpell(clazz.id) && clazz.uiDisplay)
        //console.log(spellList)
        spellList.forEach(item => {
            list.node.addChild(initNode(self.item, 'spellItem', item.id, self.node, true))
            list.updateLayout();
            list.node.y = 445 - list.node.height / 2
        })
        
        //console.log(this.node)
    },

    refreshUnLearnSpell() {
        //this._refresh(false)
        this.list.node.removeAllChildren()

        let self = this, list = this.list
        let deck = spell(), player = getCurrPlayer()
        let learned = deck.filter(clazz => player.findSpell(clazz.id))
        let unLearn = deck.filter(clazz => !player.findSpell(clazz.id))

        learned.concat(unLearn).forEach(item => {
            if(!item.uiDisplay) return
            list.node.addChild(initNode(self.item, 'spellItem', item.id, self.node));
            list.updateLayout();
            list.node.y = 445 - list.node.height / 2
        })
    },

    backBtn(){
        this.node.removeFromParent()
    },
});
const { spell, getCurrPlayer } = require('../battleMiddleWare/gameUtils');
const { initNode } = require('../otherComponents/uiUtils');