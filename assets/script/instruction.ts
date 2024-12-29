// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { journey, user } from "./Globals";
import GameEntry from "./gameEntryComponents/gameEntry";
import StartJourney from "./gameEntryComponents/startJourney";
import { sendPostForms } from "./http";

const {ccclass, property} = cc._decorator;


@ccclass
export default class InstructionManager extends cc.Component {
    @property(cc.Button)
    nextStepBtn: cc.Button = null

    @property(cc.Node)
    touchInstruction: cc.Node = null

    @property(cc.Node)
    touchArea: cc.Node = null

    @property(cc.Node)
    touchAreaCircleFrame: cc.Node = null

    @property(cc.Node)
    touchAreaRectFrame: cc.Node = null

    @property(cc.Node)
    arrowSign: cc.Node = null

    @property(cc.Node)
    textInstruction: cc.Node = null

    @property(cc.Label)
    textInstructionLabel: cc.Label = null

    @property(cc.Node)
    powerIntroductionPanel: cc.Node = null

    @property(cc.Node)
    shortHintInstruction: cc.Node = null

    @property(cc.Label)
    shortHintInstructionLabel: cc.Label = null

    @property
    sceneName: string = "gameMain"

    clicking = false
    clicked() {
        //console.log("clicked")
        if(this.clicking) return;
        //console.log("clicking sign changed")
        this.clicking = true
        let stepDetailList = this.stepsDetail
        if(user.instruction >= stepDetailList.length) {
            this.node.active = false
            return
        }
        this.stepsDetail[user.instruction].func()
        user.instruction++

        this.clicking = false
    }

    onLoad(): void {
        for(let i = 0; i < this.stepsDetail.length; i++) {
            let curr = this.stepsDetail[i], prev = this.stepsDetail[i-1]
            if(!curr.scene) curr.scene = prev.scene
        }
    }

    start () {
        let stepDetailList = this.stepsDetail
        if(user.instruction < stepDetailList.length) {
            
            let step = stepDetailList[user.instruction]
            if(step.scene != this.sceneName) {
                cc.director.loadScene(step.scene)
            } else {
                this.clicked()
            }
        } else {
            this.node.active = false
        }
        //this.changeCircleTouchArea(0, -648, 1.5)
        //this.touchAreaFrame.on(cc.Node.EventType.TOUCH_END, this.clicked)
        //this.touchAreaFrame.on(cc.Node.EventType.MOUSE_DOWN, this.clicked)
        //this.touchAreaFrame.resumeSystemEvents(true);
    }

    showCircleTouchInstruction(x: number, y: number, scale: number, darken = false) {
        this.touchInstruction.active = true
        this.touchArea.opacity = darken ? 99 : 0
        this.touchAreaCircleFrame.opacity = darken ? 255 : 0
        this.touchAreaRectFrame.opacity = 0
        let mask = this.touchArea.getComponent(cc.Mask)
        mask.type = cc.Mask.Type.ELLIPSE
        mask.segements = 64
        
        this.changeNodeAttribute(this.touchArea, x, y, scale, scale)
        this.changeNodeAttribute(this.touchAreaCircleFrame, x, y-9, scale, scale)
        this.changeArrowSign(x, y, scale)
    }

    showReactangleTouchInstruction(x: number, y: number, scaleX: number, scaleY: number, darken = false) {
        this.touchInstruction.active = true
        this.touchArea.opacity = darken ? 99 : 0
        this.touchAreaRectFrame.opacity = darken ? 255 : 0
        this.touchAreaCircleFrame.opacity = 0
        let mask = this.touchArea.getComponent(cc.Mask)
        mask.type = cc.Mask.Type.RECT
        //mask.segements = 64
        
        this.changeNodeAttribute(this.touchArea, x, y, scaleX, scaleY)
        this.changeNodeAttribute(this.touchAreaRectFrame, x, y, scaleX, scaleY)
        this.changeArrowSign(x, y, scaleY)
        
    }

    changeArrowSign(x: number, y: number, scale: number) {
        this.touchInstruction.active = true
        let revertSign = y <= 0 ? 1 : -1
        let arrowScale = Math.min(scale,3)
        let height = this.touchAreaCircleFrame.height * scale / 2 + this.arrowSign.height * arrowScale / 2
        let initY = y + height * revertSign

        let moveY = [0]
        //console.log(moveY.le)
        for(let i = 1; i <= 30; i++) moveY.push(moveY[moveY.length - 1] + Math.min(i, 20)*0.05)
        for(let i = 30; i >= 1; i--) moveY.push(moveY[moveY.length - 1] - Math.min(i, 20)*0.05)

        this.arrowPositions = moveY.map(y => y*revertSign + initY)
        //console.log(this.arrowPositions)
        this.changeNodeAttribute(this.arrowSign, x, initY, arrowScale, arrowScale * revertSign)
    }

    changeNodeAttribute(node: cc.Node, x, y, scaleX, scaleY) {
        node.active = true
        node.x = x
        node.y = y
        node.scaleX = scaleX
        node.scaleY = scaleY
    }

    showTextInstruction(text: string, animate: boolean = false) {
        let self = this
        self.textInstruction.active = true
        let showText = () => {
            self.textInstructionLabel.string = text
        }
        if(animate) {
            this.nextStepBtn.interactable = false
            setTimeout(()=>self.nextStepBtn.interactable = true, 200)
            let node = this.textInstruction
            node.opacity = 105
            node.scale = 0.5
            let fn = () => {
                node.opacity += 15
                node.scale += 0.05
                if(node.opacity < 255 || node.scale < 1) {
                    setTimeout(fn, 20)
                } else {
                    showText()
                }
            }
            setTimeout(fn, 20)
        } else {
            showText()
        }
    }

    showShortHintInstruction(content: string) {
        this.shortHintInstruction.active = true
        this.shortHintInstruction.opacity = 255
        this.shortHintInstructionLabel.string = content
    }

    hideTextInstruction() {this.textInstruction.active = false}
    hideTouchInstruction() {this.touchInstruction.active = false}
    hideShortHintInstruction() {this.shortHintInstruction.active = false}

    slowHideShortHint() {
        let self = this
        let tranparent = ()=> {
            self.shortHintInstruction.opacity -= 5
            if(self.shortHintInstruction.opacity > 0) {
                setTimeout(tranparent, 50)
            } else {
                self.hideShortHintInstruction()
            }
        }
        setTimeout(tranparent, 1000)
    }

    hideTouchArea() {
        this.touchAreaCircleFrame.active = false
        this.touchAreaRectFrame.active = false
        this.touchArea.opacity = 0
    }
    arrowPositions: number[] = []
    lastUpdateFrame: number = 0
    update(dt: number): void {
        let now = Date.now()
        if(now > this.lastUpdateFrame + 20) {
            this.lastUpdateFrame = now
        } else {
            return
        }
        //console.log(this.arrowPositions)
        let y = this.arrowPositions.shift()
        this.arrowSign.y = y
        this.arrowPositions.push(y)
    }

    stepsDetail = [
        {
            scene: "hall",
            func: () => {
                this.showTextInstruction("哇是新的云游者吗？初次见面哦，我叫瑶音!\n\n你看起来对这里还不是很熟悉呢，没关系，我刚来的时候也是这样啦\n\n走，带你去转转!", true)
            }
        },
        {
            func: () => {
                this.hideTextInstruction()
                this.showCircleTouchInstruction(0, -180, 4, true)
            }
        },
        {
            func: () => {
                console.log(cc.director.getScene().name)
                cc.director.loadScene('gameEntry')
            }
        },
        {
            scene: "gameEntry",
            func: () => {
                updateInstructionProgress()
                this.showTextInstruction("外出游历是云游者们提升实力最重要的途径，在这里，每次的外出游历都可以让你的实力获得极大的提升", true)
            }
        },
        {
            func: () => {
                this.showTextInstruction("每次游历都需要三个人一起行动哦，我们先去找两个同行的队友吧")
            }
        },
        {
            func: () => {
                this.hideTextInstruction()
                this.hideTouchArea()
                this.showCircleTouchInstruction(221.037, -565.865, 2)
            }
        },
        {
            func: () => {
                gameEntry().addGameBtn()
                this.hideTouchArea()
                this.showReactangleTouchInstruction(0, -244.123, 1, 0.7)
            }
        },
        {
            func: () => {
                startJourney().sendBtn()
                this.hideTouchArea()
                this.showReactangleTouchInstruction(-120, -60, 0.6, 0.3)
            }
        },
        {
            func: () => {
                gameEntry().choose.active = false
                setJourneyInfo()
                gameEntry().refreshRooms()
                this.hideTouchInstruction()
                this.showTextInstruction("匹配结果会在每晚23：20公布，不过这次有我和姐姐和你同行，就不用你等啦")
            }
        },
        {
            func: () => {
                this.hideTextInstruction()
                this.showReactangleTouchInstruction(-2, 450, 3.6, 1.3)
                //this.showTextInstruction("每次游历的三个人各自有一个落脚点，修行位置都是随机的哦。但如果你对某个位置情有独钟，有个办法能让你优先选择——那就是位置竞价啦！你可以用灵石作为代价，愿意付出更多灵石的云游者就能先选位置哦。")
            }
        },
        {
            func: () => {
                gameEntry().layout.node.children[0].getComponent('entryTemplate').entryBtn()
                //cc.director.loadScene("gameMain")
            }
        },
        {
            scene: "gameMain",
            func: () => {
                //updateInstructionProgress(999)
                //updateInstructionProgress()
                this.hideTouchInstruction()
                this.showTextInstruction("瞧，我们现在来到了这片传说中的福地！我们要做的就是在这里尽可能多的提升自己的修为。", true)
            }
        },
        {
            func: () => {
                this.powerIntroductionPanel.active = true
                this.showTextInstruction("修为分为两个部分：灵力和境界。你的修为越高，在比试中就可以有更快的攻击速度。")
            }
        },
        {
            func: () => {
                this.showTextInstruction("尾数部分代表你的灵力，当你的灵力值满足一定条件的时候，很多修炼都可以获得额外的修为成长。所以当你修炼之前要好好安排一下，想想怎样才能最快的提升修为~")
            }
        },
        {
            func: () => {
                this.showTextInstruction("指数部分则代表境界，当你的灵力达到10时，你的境界便会提升一级，反正当你的灵力将至1以下，你的境界便会跌落一级。境界每高一级，你获得灵力时增长的修为都会多十倍呢。")
            }
        },
        {
            func: () => {
                //updateInstructionProgress()
                this.powerIntroductionPanel.active = false
                this.showTextInstruction("唉？云游者你现在的灵力很高唉，已经可以直接飞升至下一个境界了，让我教教你如何飞升吧")
            }
        },
        {
            func: () => {
                
                this.hideTextInstruction()
                this.showCircleTouchInstruction(140, -565-77.867, 0.8)
            }
        },
        {
            func: () => {
                gameMain().spellBtn()
                this.showReactangleTouchInstruction(149.221, 255.221, 1.2, 0.5)
            }
        },
        {
            func: () => {
                spellDeck().refreshUnLearnSpell()
                //点击第一个灵符
                this.showReactangleTouchInstruction(-200, 104.539, 0.9, 0.9)
            }
        },
        {
            func: () => {
                spellItem(0).seeDetailBtn()
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                clickBuySpellBtn()
                this.hideTouchInstruction()
                this.showTextInstruction("不错，你现在已经学会如何飞升了，不过飞升需要灵气，空手可飞升不了，我们用灵石炼制一下灵符吧")
            }
        },
        {
            func: () => {
                this.hideTextInstruction()
                this.showShortHintInstruction("炼制三个飞升灵符(0/3)")
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                clickBuySpellBtn()
                this.showShortHintInstruction("炼制三个飞升灵符(1/3)")
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                clickBuySpellBtn()
                this.showShortHintInstruction("炼制三个飞升灵符(2/3)")
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                
                clickBuySpellBtn()
                this.showShortHintInstruction("炼制三个飞升灵符(3/3)")
                this.slowHideShortHint()
                this.hideTouchInstruction()
                this.showTextInstruction("除了飞升，还有一样非常重要的灵符，我们也去炼制一下吧~")
            }
        },
        {
            func: () => {
                this.hideTextInstruction()
                spellDetail().closeBtn()
                this.showReactangleTouchInstruction(-200, -94.539, 0.9, 0.9)
            }
        },
        {
            func: () => {
                spellItem(3).seeDetailBtn()
                this.hideTouchInstruction()
                this.showTextInstruction("当某位云游者或仙兽的灵力百分位为0时，对他使用“归尘韵”可以在让你获得一枚【土印记】。土印记是很有用的，无论你怎么修炼都离不开它哦")
                //this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                //spellItem(3).seeDetailBtn()
                this.hideTextInstruction()
                this.showShortHintInstruction("学习【归尘韵】")
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                this.showShortHintInstruction("炼制一枚【归尘韵】")
                clickBuySpellBtn()
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                this.slowHideShortHint()
                clickBuySpellBtn()
                this.hideTouchInstruction()
                this.showTextInstruction("材料不足？对了，炼制归尘韵需要特殊的土灵石才行，我们的仙兽可以帮我们炼化出来，去找他们炼化一下吧")
            }
        },
        {
            func: () => {
                //引导底部导航栏仙兽键
                spellDetail().closeBtn()
                spellDeck().backBtn()
                this.hideTextInstruction()
                this.showCircleTouchInstruction(280, -565-77.867, 0.8)
            }
        },
        {
            func: () => {
                //引导仙兽涧第一只
                gameMain().petsBtn()
                this.showReactangleTouchInstruction(-200, 174, 0.9, 0.9)
            }
        },
        {
            func: () => {
                //点击炼化类型
                petItem(0).seeDetailBtn()
                this.showReactangleTouchInstruction(220, 291, 1.4, 0.9)
            }
        },
        {
            func: () => {
                //点击土灵石
                creatureDetail().selectMiningType()
                this.showReactangleTouchInstruction(194, 169.3, 0.3, 0.3)
            }
        },
        {
            func: () => {
                creatureDetail().setMiningGeoCoin()
                this.hideTouchInstruction()
                this.showTextInstruction("棒！这样这只仙兽就开始炼化土灵石啦！\n\n你每10分钟可以获得10灵石，而每只仙兽每10分钟可以将2颗灵石转换为特殊灵石")
            }
        },
        {
            func: () => {
                creatureDetail().closeBtn()
                petDeck().backBtn()
                
                this.showTextInstruction("得心应手的兵刃也很重要，去打造两把剑吧")
            }
        },
        {
            func: () => {
                this.hideTextInstruction()
                //引导底部导航栏剑谱键
                this.showCircleTouchInstruction(0, -565-77.867, 0.8)
            }
        },
        {
            func: () => {
                gameMain().equipBtn()
                //点击第十三个武器
                this.showReactangleTouchInstruction(-200, -185.549-380, 0.9, 0.9)
            }
        },
        {
            func: () => {
                equipItem(12).seeDetailBtn()
                this.hideTouchInstruction()
                this.showTextInstruction("拥有【灵泉】后，每当你获得或消耗特殊灵石，你的灵力值都可以相应变化，这样你每次花钱后都有可能有触发归尘韵的机会哦")
            }
        },
        {
            func: () => {
                //点击锻造键
                this.hideTextInstruction()
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                equipDetail().buyBtn()
                this.hideTouchInstruction()
                this.showTextInstruction("很好，这样【灵泉】就开始锻造啦，我们再去锻造一把吧！")
            }
        },
        {
            func: () => {
                equipDetail().closeBtn()
                //点击第七个武器
                this.showReactangleTouchInstruction(-200, -185.549, 0.9, 0.9)
            }
        },
        {
            func: () => {
                equipItem(6).seeDetailBtn()
                this.hideTouchInstruction()
                this.showTextInstruction("【浅海】则可以让你在每次切磋都能改变不少人的灵力，如果运气好的话，你可能会收获很多土印记呢")
            }
        },
        {
            func: () => {
                //点击锻造键
                this.hideTextInstruction()
                this.showReactangleTouchInstruction(-1.579, -415.252, 1.1, 0.5)
            }
        },
        {
            func: () => {
                equipDetail().buyBtn()
                this.hideTouchInstruction()
                this.showTextInstruction("棒！这样另一把剑也开始锻造啦！")
            }
        },
        {
            func: () => {
                equipDetail().closeBtn()
                equipDeck().backBtn()
                this.showTextInstruction("锻造灵剑，炼制灵符，炼化灵石都需要不少时间，趁这段时间我们先切磋一下吧，这对你的修为提升帮助很大哦")
            }
        },
        {
            func: () => {
                this.hideTextInstruction()
                //引导底部导航栏移动键
                this.showCircleTouchInstruction(-140, -565-77.867, 0.8)
            }
        },
        {
            func: () => {
                gameMain().moveBtn()
                this.hideTextInstruction()
                //引导地图4-4
                this.showReactangleTouchInstruction(-2, -52.6, 0.45, 0.45)
            }
        },
        {
            func: () => {
                mapGrid(3*7+3).onClickCallback()
                //引导底部导航栏切磋键
                this.showCircleTouchInstruction(-280, -565-77.867, 0.8)
            }
        },
        {
            func: () => {
                gameMain().attackBtn()
                //引导地图4-3
                this.showReactangleTouchInstruction(-131, -52.6, 0.45, 0.45)
            }
        },
        {
            func: () => {
                mapGrid(3*7+2).onClickCallback()
                this.hideTouchInstruction()
                this.showTextInstruction("在切磋中，你每次造成伤害都能提升自己的灵力，造成的伤害越高提升的灵力就越多")
            }
        },
        {
            func: () => {
                this.showTextInstruction("另外，如果当你攻击时，你的灵力值百分位正好为7，那你这次攻击就可以暴击，造成两倍的伤害。")
            }
        },
    ]
}
function gameEntry() {
    return cc.find("Canvas").getComponent(GameEntry)
}

function startJourney() {
    return gameEntry().choose.getComponent(StartJourney)
}

function gameMain() {
    return cc.find("Canvas").getComponent("gameMain")
}

function journeyMap() {
    return gameMain().map.getComponent("map")
}

function mapGrid(index: number) {
    return journeyMap().layout.node.children[index].getComponent('gridIcon')
}

function equipDeck() {
    return cc.find("Canvas/equip").getComponent("equips")
}

function equipItem(id: number) {
    return equipDeck().list.node.children[id].getComponent('equipItem')
}

function equipDetail() {
    return cc.find("Canvas/equipDetail").getComponent("equipDetails")
}

function spellDeck() {
    return cc.find("Canvas/spell").getComponent("spells")
}

function spellItem(id: number) {
    return spellDeck().list.node.children[id].getComponent('spellItem')
}

function spellDetail() {
    return cc.find("Canvas/spellDetail").getComponent("spellDetails")
}

function petDeck() {
    return cc.find("Canvas/pet").getComponent("pets")
}

function petItem(id: number) {
    return petDeck().ownList.node.children[id].getComponent('petItem')
}

function creatureDetail() {
    return cc.find("Canvas/creatureDetail").getComponent("creatureDetails")
}

function clickBuySpellBtn() {
    spellDetail().useBtn()
}

function updateInstructionProgress(index?: number) {
    if(!index) index = user.instruction
    sendPostForms("/player/updateInstruction", index.toString(), ()=>{})
}

function setJourneyInfo() {
    journey.rooms = [{
        "roomid": 114514,
        "player1id": 273,
        "player2id": 1,
        "player3id": user.userid,
        "level": 0,
        "playerInfo": [
            {
                "userid": 273,
                "nickname": "清沐瑶音",
                "iconUrl": "file:heroIcon/2.png",
                "decorations": [
                    {
                        "userid": 274,
                        "category": "hero",
                        "index": 2,
                        "using": 1
                    },
                    {
                        "userid": 274,
                        "category": "player",
                        "index": 2,
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
                "trophic": 0,
                "maxTrophic": 0,
                "enrolledDate": "",
                "learningRate": 0,
                "instruction": 0
            },
            {
                "userid": 0,
                "nickname": "寒英刃华",
                "iconUrl": "file:heroIcon/3.png",
                "decorations": [
                    {
                        "userid": 275,
                        "category": "hero",
                        "index": 3,
                        "using": 1
                    },
                    {
                        "userid": 275,
                        "category": "player",
                        "index": 3,
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
                "trophic": 0,
                "maxTrophic": 0,
                "enrolledDate": "",
                "learningRate": 0,
                "instruction": 0
            },
            {
                "userid": user.userid,
                "nickname": user.nickname,
                "iconUrl": "file:heroIcon/4.png",
                "decorations": [
                    {
                        "userid": 315,
                        "category": "hero",
                        "index": 4,
                        "using": 1
                    },
                    {
                        "userid": 315,
                        "category": "player",
                        "index": 4,
                        "using": 1
                    },
                    {
                        "userid": 315,
                        "category": "scene",
                        "index": 4,
                        "using": 1
                    },
                    {
                        "userid": 315,
                        "category": "userIcon",
                        "index": 1,
                        "using": 1
                    }
                ],
                "game_times": 0,
                "win_times": 0,
                "power": 0,
                "gems": 0,
                "trophic": 0,
                "maxTrophic": 0,
                "enrolledDate": "",
                "learningRate": 0,
                "instruction": 0
            }
        ],
        "observing": {
            "logs": [],
            "status": 0
        },
        "entrying": {
            "logs": [],
            "status": 0
        },
        "records": getRouter("classic-latest").startCommands({auctions:[0,0,0], level:7}),
        "overview": {
            "power": "7e9",
            "iconList": [
                {
                    "type": "BasePet",
                    "level": 0
                },
                {
                    "type": "BasePet",
                    "level": 0
                },
                {
                    "type": "BasePet",
                    "level": 0
                },
                {
                    "type": "BasePet",
                    "level": 0
                },
                {
                    "type": "BasePet",
                    "level": 0
                },
                {
                    "type": "BasePet",
                    "level": 0
                },
                {
                    "type": "BasePet",
                    "level": 0
                },
                {
                    "type": "BasePet",
                    "level": 0
                }
            ]
        },
        "startTime": Math.floor(Date.now()/1000),
        "version": "classic-latest",
        "results": 0
    }]
}
import {getRouter} from "./xjfz-journey"
