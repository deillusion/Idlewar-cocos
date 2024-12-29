

cc.Class({
    extends: cc.Component,
    properties: {
        bg:cc.Sprite,
        icon:cc.Sprite,
        animation:cc.Node,
        animation2:cc.Node,
        pyroSign: cc.Sprite,
        hydroSign: cc.Sprite,
        selectionFrame:cc.Button,
        info:null,
        playerDetails:cc.Prefab,
        creatureDetails: cc.Prefab,
        _iconUrl: null,
        x: -1,
        y: -1,
        clickCallback: null
    },
    
    /**
     * 
     * @param {Creature} data 
     */
    init(data, x, y){
        this.x = x
        this.y = y
        this.info=data;
        
        let self = this, icon = this.icon, address = null;
        if(data){
            let code = data.type == "Player" ? data.code : data.owner.code
            cc.loader.loadRes(`texture/${code}.png`, cc.SpriteFrame, function (err, spriteFrame) {
                if(err) console.log(err);
                self.bg.spriteFrame = spriteFrame;
            });

            //console.log(data.type.toLowerCase())

            address = typeDict()[data.type].iconUrl.replace("pets", "petIcon")
            if(data.type == 'Player') {
                address = getPlayerIconUrl(code)
            }
            
            cc.loader.loadRes(address, cc.SpriteFrame, function (err, spriteFrame2) {
                if(err) console.log(err);
                icon.spriteFrame = spriteFrame2;
            });

            this.hydroSign.node.active = data.hydroSign > 0
            if(data.pyroSign > 0) {
                this.pyroSign.node.active = true
                let iconUrl = data.pyroSign >= 9 ? "icons/火印记.png" : `icons/pyroSign/${data.pyroSign}.png`
                cc.loader.loadRes(iconUrl, cc.SpriteFrame, function (err, spriteFrame2) {
                    if(err) console.log(err);
                    self.pyroSign.spriteFrame = spriteFrame2
                })
            } else {
                this.pyroSign.node.active = false
            }
        } else {
            this.hydroSign.node.active = false
            this.pyroSign.node.active = false
            this.bg.spriteFrame = null
            icon.spriteFrame = null
        }
        this._iconUrl = address
        this.recoverNodeProperties()
        this.recoverChildSequences()
    },

    setChildren(animation, animation2) {
        this.animation = animation
        this.animation2 = animation2
        //console.log(creatureIcon, animation, animation2)
    },

    recoverNodeProperties() {
        let animation = this.animation, animation2 = this.animation2, icon = this.icon.node
        animation.active = false
        animation.parent.children.filter(sibling => sibling.uuid != animation.uuid).forEach(node => node.removeFromParent())
        animation2.active = false
        animation2.parent.children.filter(sibling => sibling.uuid != animation2.uuid).forEach(node => node.removeFromParent())
        icon.active = true
        let self = this
        let setCommonProperties = (node) => {
            
            node.removeAllChildren()
            node.opacity = 255
            node.scale = 1
            node.angle = 0
            node.x = 0
            node.y = 0
            node.color = new cc.Color(255, 255, 255)
            node.width = this.node.width
            node.height = this.node.height

        }
        setCommonProperties(animation)
        setCommonProperties(animation2)
        setCommonProperties(icon)
    },

    recoverChildSequences() {
        let children = [this.bg.node, this.icon.node, this.hydroSign.node, this.pyroSign.node, this.selectionFrame.node]
        //console.log(children)
        children.forEach((child, index) => child.zIndex = index)
    },

    seeDetails(){
        if(this.info) {
            let node
            if(this.info.type == 'Player') {
                node=initNode(this.playerDetails, 'playerDetails', this.info);
            } else {
                node=initNode(this.creatureDetails, 'creatureDetails', this.info);
            }
            root().addChild(node);
        }
    },

    enableSelection(active, fn){
        this.selectionFrame.node.active = true;
        this.selectionFrame.enabled = active
        this.selectionFrame.node.opacity = active ? 0 : 120
        //this.icon.node.color = active ? new cc.Color(255,255,255) : new cc.Color(120, 120, 120)
        this.clickCallback = fn
    },

    onClickCallback() {
        this.clickCallback(this.x, this.y)
        //mapNode().recover()
    },

    recover(){
        this.selectionFrame.node.active = false 
        //this.icon.node.color = new cc.Color(255,255,255)
        this.clickCallback = ()=>null
    },

    start() {
        let self = this;
        setInterval(()=> {
            if(config.playAnimation) {
                gameGlobals.animationPlayer.play({animationIcon:self.animation, animation2Icon: self.animation2, gridIcon:self.icon.node, x: self.x, y: self.y, iconUrl: self._iconUrl})
            }
        }, 16)
        
    }
});
const color=[new cc.Color(238,228,207,255),new cc.Color(94,117,99,255),new cc.Color(211,176,154,255),new cc.Color(199,165,101,255)]
const { DECORATION_MENU } = require('../Constants');
const { config } = require('../Globals');
const gameGlobals = require('../battleMiddleWare/gameGlobals');
//const { decoration } = require('../Globals');
const { typeDict, mapNode, getPlayerIconUrl } = require('../battleMiddleWare/gameUtils');
const { FrameTimer } = require('../otherComponents/frameTimer');
const { initNode, root } = require('../otherComponents/uiUtils');
const { Creature } = require('../xjfz-journey/classic-latest/main/Creature');
