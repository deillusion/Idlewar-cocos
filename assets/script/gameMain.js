
cc.Class({
    extends: cc.Component,
    properties: {
        //上方的操作栏
        observe:cc.Node,
        entry:cc.Node,
        history:cc.Node,
        send:cc.Node,
        calculator: cc.Node,
        mockingSign: cc.Node,
        //中上方三个玩家
        players:cc.Node,
        //中部核心地图
        map:cc.Node,
        tiles:cc.Prefab,
        //底部五个界面
        equips:cc.Prefab,
        spells:cc.Prefab,
        pets:cc.Prefab,
        forge:cc.Prefab,
        //控制台
        control:cc.Node,
        //发起挑战后的界面
        fightUI:cc.Node,
        
        //攻击键被点击后状态改变
        attack:true,
        
        //新加的分割线
        _zIndexMap: null,
    },
    onLoad() {
        checkInstruction()
        this.node.on(cc.Node.EventType.TOUCH_END, this.clicked)
    },
    start () {
        
        cc.audioEngine.stopMusic();  
        cc.loader.loadRes('audio/journey', cc.AudioClip, function (err, clip) {
            cc.audioEngine.playMusic(clip, true);
            cc.audioEngine.setMusicVolume(config.bgm);
            if(config.bgm == 0) {
                cc.audioEngine.pauseMusic()
            }
            music.playingType = 'journey'
        });
        if(gameGlobals.isMocking){
            this.mockingSign.active = true
            this.observe.active = false
            this.entry.active = false
            this.send.active = false
        } else {
            switch(user.userid) {
                case gameGlobals.gameInfo.player1id: gameGlobals.currPLayerIndex = 1; break
                case gameGlobals.gameInfo.player2id: gameGlobals.currPLayerIndex = 2; break
                case gameGlobals.gameInfo.player3id: gameGlobals.currPLayerIndex = 3; break
            }   
        }

        //console.log(this)
        let zIndexMap = {}
        this.node.children.forEach((child, index) => {
            zIndexMap[child.uuid] = -1000 + index
            child.zIndex = -1000 + index
        })
        
        this._zIndexMap = zIndexMap
        this.players.children.forEach((player, index) => player.getComponent('playerPanel').init(index+1));
        this.map.getComponent('map').init();
        
        this.control.getComponent('console').init()
        this.refresh()
        
    },
    refresh() {
        this.observe.getComponent('observeAndEntry').refresh()
        this.entry.getComponent('observeAndEntry').refresh()
        this.map.getComponent('map').refresh();
        this.control.getComponent('console').refresh()
        this.send.getComponent('submit').refresh()
        if(cc.find('Canvas/pets')) {
            cc.find('Canvas/pets').getComponent('pets').refresh()
        }
        //this.pets.getComponent('pets').refresh();
        //this.equips.getComponent('equips').refresh();
        //this.spells.getComponent('spells').refresh();
        
        this.players.children.forEach(player => player.getComponent('playerPanel').refresh());

        let self = this
        this.node.children.forEach((child, index) => {
            child.zIndex = self._zIndexMap[child.uuid]
        })

        temp.gameMainRefreshing = false
        //this.history.getComponent('history').refresh();
    },
    attackBtn(){
        let coordinates = getCurrPlayer().challengeAbleItems
        let self = this
        this.map.getComponent('map').enableSelection(coordinates, function(x, y) {
            makeOperation(`at${x}${y}`)
            if(config.playAnimation) {
                let player1Code = gameGlobals.currPLayerIndex
                let player2Code = gameGlobals.gameObj.map[y][x].code
                self.fightUI.getComponent('fightUI').init(player1Code, player2Code)
                self.fightUI.active = true
                self.fightUI.zIndex = 201
            }
        })
    },
    equipBtn(){
        this.node.addChild(cc.instantiate(this.equips))
    },
    spellBtn(){
        this.node.addChild(cc.instantiate(this.spells))
    },
    moveBtn(){
        let coordinates = getCurrPlayer().findSpell(MoveSpell.id).validLocations()
        this.map.getComponent('map').enableSelection(coordinates, function(x, y) {
            makeOperation(`us${x}${y}00`)
        })
    },
    petsBtn(){
        this.node.addChild(cc.instantiate(this.pets))
    },
    forgingBtn(){
        this.node.addChild(cc.instantiate(this.forge))
    },
    historyBtn(){
        loadingView()
        this.history.getComponent('history').init()
        this.history.zIndex = 201
        this.history.active = true;
        completeLoading()
    },
    backBtn(){
        cc.director.loadScene('hall');
    },
    fighting(player1,player2){
        var battle=cc.instantiate(this.fightUI);
        battle.init(player1,player2);
    },
    calculatorBtn() {
        this.calculator.getComponent('calculatorManager').refresh()
        this.calculator.active = true
    },
    clicked() {
        console.log('game main clicked')
        cc.find("instruction").getComponent('instruction').clicked()
        
    }
});
const { config, music, user, temp } = require('./Globals');
const gameGlobals = require('./battleMiddleWare/gameGlobals');
const { makeOperation } = require('./battleMiddleWare/gameService');
const { getCurrPlayer } = require('./battleMiddleWare/gameUtils');
const { loadingView, completeLoading, checkInstruction } = require('./otherComponents/uiUtils');
const { MoveSpell } = require('./xjfz-journey/classic-latest/main/Spell');
