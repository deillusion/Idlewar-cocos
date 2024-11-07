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
    label: cc.Label = null

    @property(cc.Label)
    nickname: cc.Label = null

    @property(cc.Label)
    trophyLbl: cc.Label = null

    @property(cc.Label)
    gemLbl: cc.Label = null

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Node)
    setting: cc.Node = null

    @property(cc.Node)
    email: cc.Node = null

    @property(cc.Node)
    board: cc.Node = null

    @property(cc.Node)
    top: cc.Node = null

    @property(cc.Prefab)
    userDetail: cc.Prefab = null

    ascend: boolean = true

    onLoad () {
        this.nickname.string = "" + user.nickname
        this.trophyLbl.string = "" + user.trophic
        this.gemLbl.string = "" + user.gems
        this.icon.getComponent("icon").init(user.iconUrl)
        //this.setting.getComponent('setting').init()
    }

    start () {
        if(!cc.audioEngine.isMusicPlaying() || music.playingType == 'journey') {
            cc.loader.loadRes('audio/hall', cc.AudioClip, function (err, clip) {
                cc.audioEngine.playMusic(clip, true);
                cc.audioEngine.setMusicVolume(config.bgm);
                if(config.bgm == 0) {
                    cc.audioEngine.pauseMusic()
                }
            });
        }
        
    }
    startBtn(){
        loadingView()
        cc.director.loadScene("gameEntry");
    }
    historyBtn() {
        cc.director.loadScene("history")
    }
    decorationBtn() {
        cc.director.loadScene("decoration");
    }
    tvBtn() {
        cc.director.loadScene("tv")
    }
    mockBtn(){
        cc.director.loadScene("mock");
    }
    viewUserDetailBtn(){
        var detail=cc.instantiate(this.userDetail);
        detail.getComponent('userDetail').init(user.userid);
        this.node.addChild(detail);
    }

    settingBtn(){
        this.setting.active=true;
    }

    boardBtn() {
        this.board.active = true
    }

    topBtn() {
        this.top.active = true
    }

    emailBtn() {
        this.email.active = true
    }

    update (dt) {
        if(this.ascend){
            this.label.node.opacity++;
            //this.icon.y+=0.2;
            if(this.label.node.opacity==255){
                this.ascend=false;
            }
        }else{
            this.label.node.opacity--;
            //this.icon.y-=0.2;
            if(this.label.node.opacity==127){
                this.ascend=true;
            }
        }
        

        //cc.loader.loadResDir
    }
}
//import user = require('./userComponents/userGlobals');
//import user from './userComponents/userGlobals'
import { config, music, user } from './Globals';
import { loadingView } from './otherComponents/uiUtils'