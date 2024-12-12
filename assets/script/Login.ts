// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { auth, user } from "./Globals";
import { sendGetForms, sendPostForms } from "./http";
import { danMu } from "./otherComponents/uiUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {

    }

    Login() {
        switch(cc.sys.os) {
            case cc.sys.OS_ANDROID : {
                this.loginByAndroid()
                break
            }
            case cc.sys.OS_IOS:
                this.loginByIOS()
                break
            default:
                this.loginTestAccount()
        }
        jsb.EventAssetsManager.ALREADY_UP_TO_DATE
        
    }

    loginByAndroid() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/TaptapLoginActivity", "taptapLogin", "()V")
        let fn = () => {
            let o: string = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/TaptapLoginActivity", "getLoginInfo", "()Ljava/lang/String;")
            if(!o || o.length == 0) {
                setTimeout(fn, 200)
                return
            }
            try {
                let obj = JSON.parse(o)
                this.loginByAccessKey(obj.kid, obj.macKey)
            } catch(err) {
                danMu("登录失败")
            }
        }
        setTimeout(fn, 200)
    }

    loginByIOS() {
        
    }

    loginTestAccount() {

    }

    loginByAccessKey(access_token: string, mac_key: string) {
        //TODO: 将接口换回"login/account"
        sendPostForms("/account/login/taptap", {accessToken: access_token, macKey: mac_key}, function(response) {
            Object.assign(user, response.data)
            auth.token = response.token
            auth.userid = user.userid
            cc.sys.localStorage.setItem("auth", JSON.stringify(auth))
            cc.director.loadScene('hall')
        })
    }
    update (dt) {
        
    }
}