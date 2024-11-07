// Learn cc.Class:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html



cc.Class({
    extends: cc.Component,

    properties: {
        player1Icon: cc.Sprite,
        player2Icon: cc.Sprite,
        inkAnimation: cc.Sprite,
        logPrefab: cc.Prefab,
        layout: cc.Node,
        _moved: false,
        _currIndex: 0,
        _layoutHeight: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(player1Code, player2Code) {
        let setPlayerIcon = function(code, icon) {
            let address = getPlayerIconUrl(code, 'hero')
            cc.loader.loadRes(address, cc.SpriteFrame, function (err, spriteFrame2) {
                if(err) console.log(err);
                icon.spriteFrame = spriteFrame2;
            });
        }
        setPlayerIcon(player1Code, this.player1Icon)
        setPlayerIcon(player2Code, this.player2Icon)

        this.layout.removeAllChildren()
        let parent = gameGlobals.logs[gameGlobals.logs.length - 1][0]
        let self = this
        parent.children.forEach(log => {
            let logNode = cc.instantiate(this.logPrefab)
            logNode.getComponent('historyLog').init(log)
            logNode.getComponent('historyLog').expandAll()
            logNode.opacity = 0
            self.layout.addChild(logNode)
        })
        /*setTimeout(()=> {
            self.layout.y = 340 - self.layout.height / 2
            console.log('layout height: ', self.layout.height)
            console.log('layout y: ', self.layout.y)
        }, 30)*/
        this._currIndex = 0
        this._layoutHeight = 0
    },

    addLog() {
        
        
        //let self = this
        if(this._currIndex >= this.layout.childrenCount) return
        let logNode = this.layout.children[this._currIndex]
        logNode.opacity = 255
        this._layoutHeight += logNode.height
        this._currIndex++
        if(!this._moved) {
            if(this._layoutHeight > 680) this.layout.y = this._layoutHeight - this.layout.height / 2 - 340
            else this.layout.y = 340 - this.layout.height / 2
        }
        //console.log('layout height: ', this.layout.height)
        //console.log('curr height: ', this._layoutHeight)
        /*setTimeout(()=> {
            if(!self._moved) {
                self.layout.y = self.layout.height - 340
            }
        }, 30)*/
    },

    scrolled(_, event) {
        this._moved = ![cc.ScrollView.EventType.BOUNCE_BOTTOM, cc.ScrollView.EventType.SCROLL_TO_BOTTOM].includes(event)
    },

    skip() {
        gameGlobals.animationPlayer.skip()
        //refreshPage()
        let self = this
        setTimeout(() => self.node.active = false, 100)
        
    },

    update (dt) {
        if(config.playAnimation) {
            gameGlobals.animationPlayer.play({animationIcon: this.inkAnimation, gridIcon:this.node, x: 77, y: 77, config})
        }
    },
});
const { config, decoration } = require("../Globals");
const gameGlobals = require("../battleMiddleWare/gameGlobals");
const { getPlayerIconUrl, refreshPage } = require("../battleMiddleWare/gameUtils");
