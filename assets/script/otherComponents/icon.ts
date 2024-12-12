// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { imageBase64Url } from "../Globals";
import { downloadImg } from "../http";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    iconSF: cc.Sprite = null;

    init(iconUrl: string) {
        let params = iconUrl.split(":")
        let type = params[0], url = params.slice(1).join(":")
        let self = this
        if(type == ("taptap")) {
            if(imageBase64Url[url]) {
                let spriteFrame = imageBase64Url[url]
                self.iconSF.spriteFrame = new cc.SpriteFrame(spriteFrame);
                return
            }
            cc.assetManager.loadRemote(url, cc.SpriteFrame, function (err, spriteFrame:cc.Texture2D) {
                imageBase64Url[url] = spriteFrame
                self.iconSF.spriteFrame = new cc.SpriteFrame(spriteFrame);
            });
        } else {
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                self.iconSF.spriteFrame = spriteFrame;
                //console.log(self.iconSF.spriteFrame.toString())
            });
        }
    }
}
