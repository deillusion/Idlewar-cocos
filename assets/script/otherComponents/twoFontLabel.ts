// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    ascii: cc.Prefab = null;

    @property(cc.Prefab)
    chinese: cc.Prefab = null;

    @property
    fontSize: number = 45

    @property(cc.Color)
    fontColor: cc.Color = new cc.Color(0,0,0,255)
    // LIFE-CYCLE CALLBACKS:
    temp: cc.Label
    // onLoad () {}
    init(str: string, options?: {resizeIfExceed: boolean}) {
        this.node.removeAllChildren()
        for(let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            let prefab = this.isChineseCharacter(charCode) ? this.chinese : this.ascii
            let child = cc.instantiate(prefab)
            let label = child.getComponent(cc.Label)
            label.fontSize = this.fontSize
            label.lineHeight = this.fontSize
            label.string = str.charAt(i)
            child.color = this.fontColor
            child.y = 0
            this.node.addChild(child)
        }
        if(!options) return
        if(options.resizeIfExceed) {
            let childrenWidth = this.node.children.map(child => child.width).reduce((res, width) => res+width, 0)
            if(childrenWidth > this.node.width) {
                this.getComponent(cc.Layout).resizeMode = cc.Layout.ResizeMode.CHILDREN
            }
        }
        //console.log(this.node)
        //str.charCodeAt()
    }

    isChineseCharacter(charCode: number) {
        //const charCode = char.charCodeAt(0);
        return charCode >= 0x4e00 && charCode <= 0x9fa5;
    }
    start () {

    }

    // update (dt) {}
}
