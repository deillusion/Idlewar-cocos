const global = require("./gameGlobals");
const { refreshPage, typeDict, constant } = require("./gameUtils");
const { danMu } = require("../otherComponents/uiUtils");
let journey = require("../xjfz-journey/index");
const { fillWithZero } = require("../otherComponents/commonUtils");
const { config } = require("../Globals")

let obj={
    /**
     * 
     * @param {string} version
     * @returns 
     */
    createGame: function(version) {
        if(!journey[version]) {
            danMu("无效游戏版本")
        }
        global.gameModule = journey[version]
        global.gameRouter = global.gameModule.routers
        global.gameObj = global.gameRouter.newGame()
        global.historyPosition = 0
        global.gameRecords = [global.gameObj]
        global.operations = []
    },
    copyGame: function() {
        global.gameObj = global.gameRouter.copyGame(global.gameObj)
        return global.gameObj
    },
    makeOperation:function(instru) {
        if(global.isEntering && global.historyPosition < global.initPosition) {
            danMu("修行中不要分心推演旧事")
            return
        }
        let command = `${fillWithZero(global.currTime, 6)}${global.currPLayerIndex}${instru}`
        updateGame(command)
        console.log(global.gameObj.JSONStringify())
        global.animationPlayer = global.gameObj.animationPlayer
        if(config.playAnimation) {
            let fn = () => {
                if(global.animationPlayer.isPlaying) {
                    setTimeout(fn, 20)
                } else {
                    refreshPage()
                }
            }
            setTimeout(fn, 20)
        } else {
            refreshPage()
        }
        
        
    },
    

    /**
     * 
     * @param {string[]} instructions 
     * @param {string} version 
     */
    initGame: function(instructions, version) {
        if(!version) version = global.gameVersion
        if(!journey[version]) {
            danMu("无效游戏版本")
        }
        global.gameModule = journey[version]
        global.gameRouter = global.gameModule.routers
        global.gameObj = global.gameRouter.newGame()
        //console.log("is cocos init:", global.gameRouter.isFrontEnd.cocos)
        global.historyPosition = 0
        global.gameRecords = [global.gameObj]
        global.operations = []
        global.logs = []

        instructions.forEach(command => {
            updateGame(command)
            global.currTime = global.gameObj.currTime
            global.currPLayerIndex = global.gameObj.currUser?.code
        })
        global.initPosition = global.gameRecords.length - 1
        global.historyPosition = global.initPosition
    },

    addHistory: function() {
        global.gameRecords.push(global.gameObj)
        global.gameObj.logger.aggregate()
        
        global.gameObj.logger.data.forEach(formatLogger)
        global.logs.push(global.gameObj.logger.data)
        global.historyPosition++
    }
}
module.exports = obj

function updateGame(command) {
    obj.copyGame()
    let result = global.gameRouter.updateGame(global.gameObj, [command])
    if(result!="success") {
        danMu(result)
        global.gameObj = global.gameRecords[global.historyPosition]
    } else {
        //如果在
        if(global.historyPosition < global.initPosition) {
            global.isTrying = true
        }
        global.gameRecords.splice(global.historyPosition+1)
        global.operations.splice(global.historyPosition)
        global.logs.splice(global.historyPosition)
        
        global.operations.push(command)
        obj.addHistory()
        
        if(global.isMocking) {
            //let saveObject = 
            //cc.sys.localStorage.setItem("mockHistory")
        }
        //console.log()
        
        
    }
}
function formatLogger(logger) {
    logger.content = formatLogContent(logger.content)
    logger.children?.forEach(formatLogger)
}

function formatLogContent(content) {
    let pattern = /\{"code":\d+.*?\}/
    while(content.search(pattern) >= 0) {
        let results = content.match(pattern)
        //console.log('log regex results:', results)
        //if(!results) continue
        results.forEach(result => {
            //console.log('single result: ', result)
            //let data = eval(result)
            
            let data = JSON.parse(result)
            //console.log('single result: ', data)
            let item = global.gameObj.unitDict.get(data.code)
            let name
            if(data.code <= 3) {
                name = global.gameInfo.playerInfo[data.code - 1].nickname
            } else {
                name = typeDict()[item.type].pet_name
            }
            let genStr = name
            if(data.x >= 0) {
                genStr += `(${data.x+1},${constant().MAP_SIZE-data.y})`
            } else if(data.x == undefined) {
                genStr += `(${item.x+1},${constant().MAP_SIZE-item.y})`
            }

            let code = item.type == 'Player' ? item.code : item.owner.code
            let color = ['', '5e7563','d3b09a','c7a565'][code]
            genStr = `<color=#${color}>${genStr}</c>`
            content = content.replace(result, genStr)
        })
    }
    return content
}

function generateMockOverview() {
    let info = {

    }
    return {

    }
}