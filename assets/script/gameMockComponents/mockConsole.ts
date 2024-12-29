// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    

    @property(cc.Node)
    confirmCreatingJourneyPage: cc.Node = null

    versionSelected: string = null

    @property(cc.Label)
    versionSelectedLabel: cc.Label = null

    @property(cc.ToggleContainer)
    versionSelection: cc.ToggleContainer = null

    @property(cc.EditBox)
    levelEditor: cc.EditBox = null

    level = 0

    @property(cc.Node)
    auctions: cc.Node = null

    @property(cc.Prefab)
    labelToggle: cc.Prefab = null

    

    start () {
        let versionSelectionList = this.versionSelection.node
        let version2Chinese = (version: string) => {
            let twoParts = version.split("-v")
            let rawType = twoParts[0], rawIndex = twoParts[1]
            let typeMap = {"classic": "逸尘"}
            let chinType = typeMap[rawType]
            let numMap = ["零","一","二","三","四","五","六","七","八","九"]
            let chinIndex = rawIndex.split(".").map(num => numMap[parseInt(num)]).join("")
            return `${chinType}·${chinIndex}`
        }
        let versionList: string[] = journey.VALID_VERSION_LIST.filter(version => version != "classic-latest")
        versionList.forEach((version: string) => {
            let toggle = cc.instantiate(this.labelToggle)
            let label = version2Chinese(version)
            toggle.getComponent('labelToggle').init(label, version)
            //toggle.width = 330
            versionSelectionList.addChild(toggle)
        })
        let versionToggles = this.versionSelection.toggleItems
        let lastToggle = versionToggles[versionToggles.length-1]
        lastToggle.check()

        let lastToggleComponent = lastToggle.node.getComponent('labelToggle')
        lastToggleComponent.onChecked()
        let {label, data} = lastToggleComponent.getContent()
        this.versionSelectedLabel.string = label
        this.versionSelected = data

        let containerHeight = versionToggles.length * 57
        versionSelectionList.y = 125 - containerHeight/2
        //versionSelectionList.children[versionSelectionList.childrenCount-1].
    }

    selectVersion() {
        this.versionSelection.node.parent.active = true
    }

    cancelSelectVersion() {
        this.versionSelection.node.parent.active = false
    }

    onVersionChanged() {
        let toggles = this.versionSelection.toggleItems
        let selectedToggle = toggles.find(toggle => toggle.isChecked)
        let {label, data} = selectedToggle.node.getComponent('labelToggle').getContent()
        toggles.forEach(toggle => toggle.node.getComponent('labelToggle').onChecked())
        this.versionSelectedLabel.string = label
        this.versionSelected = data
        this.versionSelection.node.parent.active = false
    }

    onLevelChanged() {
        let level = parseInt(this.levelEditor.string)
        let isValid = !isNaN(level) && level >= 0 && level <= 15
        this.levelEditor.fontColor = !isValid ? new cc.Color(255, 0, 0) : new cc.Color(255, 255, 255)
        this.level = level
    }

    

    cancelCreatingJourney() {
        this.confirmCreatingJourneyPage.active = false
    }

    confirmCreatingJourney() {
        this.confirmCreatingJourneyPage.active = true
    }

    createJourney() {
        let level = this.level, versionSelected = this.versionSelected
        let auctions = this.auctions.getComponentsInChildren(cc.EditBox)
                        .map(editbox => editbox.string ? parseInt(editbox.string) : parseInt(editbox.placeholder))
        if(auctions.find(auction => isNaN(auction) || auction < 0 || auction > 99) != undefined) {
            alertError("竞价值必须为0-99之间的正整数")
            return
        }
        if(isNaN(level) || level < 0 || level > 15) {
            alertError("请输入段位等级(0-15之间的正整数)")
            return
        }
        let routers = journey.getRouter(versionSelected)
        console.log({auctions,level})
        let commands = routers.startCommands({auctions,level})
        routers.initForCocos()
        gameService.resetGameGlobals()
        gameService.initGame(commands, versionSelected)
        Object.assign(gameGlobal.gameInfo, MOCKING_GAME_INFO)
        gameGlobal.isTrying = true
        gameGlobal.isMocking = true
        cc.director.loadScene('gameMain')
    }

    close() {
        this.node.active = false
    }
    
    // update (dt) {}
}

const MOCKING_GAME_INFO = {
    "roomid": 17,
    "player1id": -1,
    "player2id": -2,
    "player3id": -3,
    "playerInfo": [
        {
            "userid": 274,
            "nickname": "玩家1",
            "iconUrl": "file:heroIcon/4.png",
            "decorations": [
                {
                    "userid": 274,
                    "category": "hero",
                    "index": 4,
                    "using": 1
                },
                {
                    "userid": 274,
                    "category": "player",
                    "index": 4,
                    "using": 1
                },
                {
                    "userid": 274,
                    "category": "scene",
                    "index": 1,
                    "using": 1
                },
                {
                    "userid": 274,
                    "category": "userIcon",
                    "index": 0,
                    "using": 1
                }
            ],
            "game_times": 0,
            "win_times": 0,
            "power": 0,
            "gems": 0,
            "trophic": 0
        },
        {
            "userid": 275,
            "nickname": "玩家2",
            "iconUrl": "file:heroIcon/2.png",
            "decorations": [
                {
                    "userid": 275,
                    "category": "hero",
                    "index": 2,
                    "using": 1
                },
                {
                    "userid": 275,
                    "category": "player",
                    "index": 2,
                    "using": 1
                },
                {
                    "userid": 275,
                    "category": "scene",
                    "index": 4,
                    "using": 1
                },
                {
                    "userid": 275,
                    "category": "userIcon",
                    "index": 1,
                    "using": 1
                }
            ],
            "game_times": 0,
            "win_times": 0,
            "power": 0,
            "gems": 0,
            "trophic": 0
        },
        {
            "userid": 273,
            "nickname": "玩家3",
            "iconUrl": "file:heroIcon/3.png",
            "decorations": [
                {
                    "userid": 273,
                    "category": "hero",
                    "index": 3,
                    "using": 1
                },
                {
                    "userid": 273,
                    "category": "player",
                    "index": 3,
                    "using": 1
                },
                {
                    "userid": 273,
                    "category": "scene",
                    "index": 1,
                    "using": 1
                },
                {
                    "userid": 273,
                    "category": "userIcon",
                    "index": 0,
                    "using": 1
                }
            ],
            "game_times": 0,
            "win_times": 0,
            "power": 0,
            "gems": 0,
            "trophic": 0
        }
    ],
    "observing": {
        "logs": [],
        "status": 1
    },
    "entrying": {
        "logs": [],
        "status": 1
    },
    "records": [
        "0000001st000",
        "0000002st003",
        "0000003st000"
    ],
    "overview": {
        "power": "",
        "iconList": []
    },
    "startTime": 1718980800,
    "version": "classic-latest",
    "results": 0
}

import { alertError } from "../otherComponents/uiUtils";
import journey = require("../xjfz-journey/index")
import gameService = require("../battleMiddleWare/gameService.js")
import gameGlobal = require("../battleMiddleWare/gameGlobals")