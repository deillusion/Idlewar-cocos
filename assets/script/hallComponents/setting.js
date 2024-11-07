var { config } =require('../Globals');
cc.Class({
    extends: cc.Component,

    properties: {
        bgmMgr:cc.Slider,
        audioMgr:cc.Slider,
        playAnimationToggle: cc.Toggle,
        mapPreview: cc.Node,
        mapScaler: cc.Slider
    },
    start(){
        this.bgmMgr.progress=config.bgm;
        this.audioMgr.progress=config.sound;
        this.playAnimationToggle.isChecked = config.playAnimation
        this.mapScaler.progress = config.defaultMapScale
        this.refreshMapPreview()
    },
    changeBgm(){
        config.bgm = this.bgmMgr.progress;
        cc.audioEngine.setMusicVolume(config.bgm);
        cc.audioEngine.resumeMusic()
        this.saveSetting()
    },
    changeAudio(){
        config.sound = this.audioMgr.progress;
        this.saveSetting()
    },
    changePlayAnimationOption() {
        config.playAnimation = this.playAnimationToggle.isChecked
        this.saveSetting()
    },

    changeMapScale() {
        config.defaultMapScale = this.mapScaler.progress;;
        this.refreshMapPreview()
        this.saveSetting()
    },
    refreshMapPreview() {
        let scale = config.defaultMapScale + 1
        this.mapPreview.scaleX = scale
        this.mapPreview.scaleY = scale
        this.mapPreview.width = scale * 671
        this.mapPreview.height = scale * 671
    },
    changeAccount(){
        cc.sys.localStorage.removeItem("auth")
        cc.director.loadScene('Login');
    },
    saveSetting() {
        var obj = {};
        Object.assign(obj, config)
        //obj.bgm = config.bgm;
        //obj.sound = config.sound;
        cc.sys.localStorage.setItem("config", JSON.stringify(obj))
        
    },
    closeBtn(){
        this.node.active=false;
    },
});