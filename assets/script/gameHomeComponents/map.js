cc.Class({
    extends: cc.Component,
    properties: {
        inputBlocker: cc.Node,
        tiles:cc.Prefab,
        layout:cc.Layout,
        content:cc.Node,
        animationNodes:cc.Node,
        creatureIconLayout:cc.Node,
        animationLayout:cc.Node,
        animationLayout2:cc.Node,
        singleGrid: cc.Prefab,
        scaler:cc.Slider
    },
    init:function(){
        this.animationNodes.removeAllChildren()
        let MAP_SIZE = constant().MAP_SIZE
        for(let i = 0; i < MAP_SIZE*MAP_SIZE; i++) {
            
            let tile=cc.instantiate(this.tiles);
            
            let animation1 = cc.instantiate(this.singleGrid)
            let animation2 = cc.instantiate(this.singleGrid)
            //let creatureIcon = cc.instantiate(this.singleGrid)
            tile.getComponent("gridIcon").setChildren(animation1.children[0], animation2.children[0])
            this.layout.node.addChild(tile);
            this.animationLayout.addChild(animation1)
            this.animationLayout2.addChild(animation2)
            //this.creatureIconLayout.addChild(creatureIcon)
        }
        this.scaler.progress = config.defaultMapScale
        this.scale()

    },
    refresh:function(){
        this.recover()
        let MAP_SIZE = constant().MAP_SIZE
        let children = this.layout.node.children
        for(var y = 0; y < MAP_SIZE; y++){
            for(var x = 0; x < MAP_SIZE; x++){
                let tile=children[y*MAP_SIZE+x];
                tile.getComponent("gridIcon").init(gameGlobals.gameObj.map[y][x], x, y)
            }
        }
    },
    enableSelection: function(coordinates, fn) {
        let activeMap = []
        const MAP_SIZE = constant().MAP_SIZE
        for(let i = 0; i < MAP_SIZE*MAP_SIZE; i++) activeMap.push(false)
        coordinates.forEach(ord => {
            let x = ord[0], y = ord[1]
            activeMap[y*MAP_SIZE + x] = true
        })
        activeMap.forEach((active, index) => {
            let child = this.layout.node.children[index]
            child.getComponent('gridIcon').enableSelection(active, fn)
        })
        this.inputBlocker.active = true
        this.node.zIndex = 200
    }, 
    scale(){
        let scale = 1 + this.scaler.progress
        this.content.scaleX = scale
        this.content.scaleY = scale
        this.content.width = scale * 671
        this.content.height = scale * 671
    },
    recover(){
        this.layout.node.children.forEach((child, index) => {
            child.getComponent('gridIcon').recover()
        })
        this.inputBlocker.active = false
        this.node.zIndex = 0
        //refreshPage()
    },
    start() {
        setInterval(()=> {
            if(config.playAnimation) {
                gameGlobals.animationPlayer.play({x: 99, y: 99})
            }
            //console.log("animation checking")
        }, 16)
    }
});
const { config } = require('../Globals');
const gameGlobals = require('../battleMiddleWare/gameGlobals');
const { constant, refreshPage } = require('../battleMiddleWare/gameUtils');
const { FrameTimer } = require('../otherComponents/frameTimer');

