// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Color)
    color: cc.Color = new cc.Color(0,0,0,255)
    curr_index: number = 1
    count: number = 0

    start () {
        this.node.children.forEach(child => child.color = this.color)
    }

    update (dt) {
        this.count++
        if(this.count%30 != 0) return
        let children = this.node.children
        let size = children.length
        children[(this.curr_index - 1)%size].active = false
        children[this.curr_index%size].active = true
        this.curr_index++
    }
}
