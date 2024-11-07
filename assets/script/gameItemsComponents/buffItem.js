cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,
        valLbl: cc.Label,
        data:null,
        detail: cc.Node,
        description: cc.Label,
        viewLongDescription: null
    },
    init(data, fn){
        this.data=data;
        this.parent = parent
        let self = this

        let {iconUrl, value, description} = this.parseInfo(data)
        cc.loader.loadRes(iconUrl, cc.SpriteFrame, function (err, spriteFrame) {
            self.icon.spriteFrame = spriteFrame;
        });

        if(value || value == 0) {
            this.valLbl.node.active = true
            this.valLbl.string = "" + value
        }

        this.description.string = description
    },

    parseInfo(data) {
        let iconUrl, value, description
        if(["geoSign","hydroSign", 'pyroSign'].includes(data.type)) {
            let name = {geoSign: "土印记", hydroSign: "水印记", pyroSign: '火印记'}[data.type]
            iconUrl = `icons/${name}.png`
            value = data.value
            description = name
        } else {
            let clazz = typeDict()[data.type]
            iconUrl = clazz.iconUrl
            value = data.ratio
            description = clazz.description(data)
        }

        return {iconUrl, value, description}
    },

    seeDetailBtn(){
        console.log(this.description.string)
        if(this.description.string.length <= 5) {
            this.detail.active = true
            let self = this
            setTimeout(() => self.detail.active = false, 10000)
        } else {
            this.viewLongDescription(this.description.string)
        }
    },
    closeDetailBtn() {
        this.detail.active = false
    },
});
const { typeDict } = require("../battleMiddleWare/gameUtils");