
const { AnimationPlayer } = require("../xjfz-journey/classic-latest/main/animations/animationPlayer");
const journey = require("../xjfz-journey/index");

module.exports={
    gameModule: journey["classic-latest"],
    //当前的游戏数据
    gameObj: journey.getRouter('classic-latest').newGame(),
    gameInfo:{
        "roomid": 17,
        "player1id": 274,
        "player2id": 275,
        "player3id": 273,
        "playerInfo": [
            {
                "userid": 274,
                "nickname": "维尔薇的狗",
                "iconUrl": "file:heroIcon/3.png",
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
                "nickname": "土系king",
                "iconUrl": "\"file:heroIcon/1.png\"",
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
                        "index": 1,
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
                "nickname": "早C晚A",
                "iconUrl": "file:heroIcon/2.png",
                "decorations": [
                    {
                        "userid": 273,
                        "category": "hero",
                        "index": 4,
                        "using": 1
                    },
                    {
                        "userid": 273,
                        "category": "player",
                        "index": 4,
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
    },
    gameVersion: "classic-latest",
    gameRouter: journey["classic-latest"].routers,
    //开始修行前的位置
    initPosition:-1,
    //当前的游戏数据在历史中的位置
    historyPosition:1,
    //每一步的游戏数据的集合
    gameRecords:[],
    //操作指令集合
    operations:[],
    //每一步操作留下的log集合
    logs:[],
    //当前玩家(1/2/3)
    currPLayerIndex:1,
    //动画播放器
    animationPlayer: new AnimationPlayer(),
    //在游戏列表中使用，用来判断是否需要初次加载
    refreshed:false,
    //是否为模拟模式
    isTrying:false,
    //是否正在修行
    isEntering: false,
    isMocking: false,
    //当前的游戏时间(分钟)
    currTime:0,
    //

    //暂存数据，用于组件间通信
    temp:null,
    /** */
    journeyInfos:[]
}
