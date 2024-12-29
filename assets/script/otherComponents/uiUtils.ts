let obj = {
    danMu:function(str){
        console.log('triggered');
        var node = new cc.Node("danMu");
        node.width=600;
        node.height=70;
        node.x = 0
        var label = node.addComponent(cc.Label);
        //label.overflow=3; 改
        label.fontSize=70;
        label.lineHeight=70;
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.string=str;
        label.overflow = cc.Label.Overflow.RESIZE_HEIGHT
        cc.loader.loadRes("fonts/Qiuhong.ttf", cc.Font, function(err, font) {
            if(err) {
                console.log(err)
                return

            }
            label.font = font
        })
        node.color=cc.Color.WHITE;
        var outline = label.addComponent(cc.LabelOutline);
        outline.color=cc.Color.BLACK;
        outline.width=3;
        var canvas=cc.find('Canvas');
        canvas.addChild(node);
        var fn=function(){
            if(!cc.find('Canvas/danMu')) return
            node.y+=2;
            if(node.y>=50){
                node.opacity-=2;
                if(node.opacity<60){
                    node.removeFromParent();
                }
            }
            setTimeout(fn,20);
        }
        setTimeout(fn,20);
    },
    alertComponent(){
        return cc.find('Canvas/alert').getComponent('alert')
    },
    alertError(message: string){
        obj.alertComponent().show(message)
    },
    alertServerError(object: Error){
        
        transitionSign=false;
        obj.alertComponent().show(object.message);
    },
    initNode:function(prefab,name,...arg) {
        let node=cc.instantiate(prefab);
        let comp=node.getComponent(name);
        comp.init(...arg)
        return node;
    },
    loadingView:function(){
        transitionSign=true;
        var loading=cc.find('Canvas/transition');
        var sign=cc.find('Canvas/transition/realLoading');
        //sign.angle = 0
        if(!loading || !sign) {
            console.log('loading Node not found')
            return
        };
        loading.active=true;
        var fn=function(){
            if(transitionSign){
                try{
                    sign.angle += 3
                    if(sign.angle>=360){
                        sign.angle-=360;
                    }
                } catch(err) {
                    console.log(err)
                }
                
                
                setTimeout(fn,10);
            }else{
                loading.active=false;
            }
        }
        setTimeout(fn,10);
    },
    completeLoading:function(){
        transitionSign=false;
    },
    root:function(){
        return cc.find('Canvas');
    },
    checkInstruction: function() {
        let instruction = cc.find("instruction")
        let stepCount = instruction.getComponent("instruction").stepsDetail.length
        if(user.instruction < stepCount) {
            instruction.active = true
        }
    },
    alertPrefab:null
}

export = obj
var transitionSign=false;

import { user } from "../Globals";
//import InstructionManager from "../instruction";