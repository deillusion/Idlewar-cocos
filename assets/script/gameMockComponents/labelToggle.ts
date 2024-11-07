// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    data: any = null
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    init(label: string, data: any) {
        this.label.string = label
        this.data = data
    }

    getLabel() {
        return this.label.string
    }

    getContent() {
        return {
            label: this.label.string,
            data: this.data
        }
    }

    onChecked() {
        let isChecked = this.node.getComponent(cc.Toggle).isChecked
        this.label.node.color = isChecked ? new cc.Color(238, 228, 207) : new cc.Color(255, 255, 255)
    }

    // update (dt) {}
}
