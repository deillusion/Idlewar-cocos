const { config, auth, user } = require('./Globals');
const http = require('./http');
const { alertError, alertComponent } = require('./otherComponents/uiUtils');
const variables = {
    _loadedProgess: 0
}
cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel:cc.Label,
        label:cc.Label,
        byteProgress:cc.ProgressBar,
        _stateStr:'',
        _progress:0.0,
        _splash:null,
        _isLoading:false,
        _updating: false,
        _canRetry: false,
        _storagePath: '',
        _am: null,
        manifestUrl: {
            type: cc.Asset,
            default: null
        },
    },
    // use this for initialization
    onLoad: function () {
        //cc.game.setFrameRate(60)
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        //this.tipLabel.string = this._stateStr;
        let localConfig = JSON.parse(cc.sys.localStorage.getItem("config"))
        Object.assign(config, localConfig)
        cc.sys.localStorage.setItem("auth", JSON.stringify({userid:274,token:"kMgoQ1KnQ8CIz/cfmfhRNQ=="}))  

        this._splash = cc.find("初始画面/logo");
        cc.find("初始画面").active = true
        
        this.nextSceneName = null
    },
    
    start:function(){   
           
        var self = this;
        var SHOW_TIME = 1000;
        var FADE_TIME = 500;
        
        var t = Date.now();
        var fn = function(){
            //console.log(variables._loadedProgess)
            var dt = Date.now()-t;
            if(dt < SHOW_TIME){
                setTimeout(fn,33);
            }
            else {
                var op = (1 - ((dt - SHOW_TIME) / FADE_TIME)) * 255;
                if(op < 0){
                    self._splash.opacity = 0;
                    cc.find("初始画面").active = false
                    self.Loading()
                }
                else{
                    self._splash.opacity = op;
                    setTimeout(fn,33);   
                }
            }
        };
        setTimeout(fn,33);
        setTimeout(self.loadResources, 0);    
        self.checkLoginStatus()
        self.handleHotUpdate()
    },

    
    loadResources() {
        let files = cc.resources.getDirWithPath("", cc.Asset).map(item => {
            let type;
            let path = item.path
            
            if(path.startsWith("fonts")) {
                type = cc.Font
            } else if(path.startsWith("audio")) {
                type = cc.AudioClip
            } else {
                type = cc.SpriteFrame
            }
            return { type, path }
        })
        let size = files.length
        let loadedNum = 0
        files.forEach(item => cc.resources.load(item.path, item.type, function(err, res) {
            loadedNum ++;
            variables._loadedProgess = loadedNum/size
            if(!res) return
            res.addRef()
        }))
    },
    Loading(){
        this.byteProgress.progress = 0
        var self=this;
        
        let intervalId = setInterval(function(){
            if(!self._canRetry) return
            let _loadedProgess = variables._loadedProgess ? variables._loadedProgess : 1
            if(!self.byteProgress) return
            let progress = self.byteProgress.progress
            if(progress >= 1) {
                clearInterval(intervalId)
                cc.director.loadScene(self.nextSceneName)
                //return
            }
            if(progress < _loadedProgess && (progress < 0.9 || self.nextSceneName)) {
                progress += 0.01
                self.byteProgress.progress = progress;
                self.label.string = `加载中 ${Math.round(progress * 100)}%`
            }
            //setTimeout(fn2,10);
            
        }, 10)
        //setInterval(fn2, 10)
        //setTimeout(fn2,10);
    },
    checkLoginStatus(){
        let self = this
        var authInfo = cc.sys.localStorage.getItem("auth");
        if( authInfo ) {
            Object.assign(auth, JSON.parse(authInfo))
            http.sendGetForms("account/checkLoginStatus", {}, function(response) {
                console.log(response)
                Object.assign(user, response)
                self.nextSceneName = "hall"
            },{noLoadingView: true})
        } else {
            this.nextSceneName = "Login"
        }
    },
    handleHotUpdate() {
        //node version_generator.js -v 1.0.17 -u https://file.idlewar.online/idlewar/ -s build/jsb-link/ -d assets/
        if (!cc.sys.isNative) {
            this._canRetry = true;
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(8);
            //this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
        
        this.byteProgress.progress = 0;
        this.hotUpdate()
    },
    hotUpdate() {
        console.log("VillV am:", this._am)
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));
            console.log("VillV callback set")
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._am.update();
            //this.panel.updateBtn.active = false;
            this._updating = true;
        }
    },
    updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.byteProgress.progress = event.getPercent();
                let downloadedBytes = event.getDownloadedBytes(), totalBytes = event.getTotalBytes();
                let divisions, unit
                if(totalBytes > 1024*1024) {
                    divisions = 1024*1024
                    unit = 'MB'
                } else if(totalBytes > 1024) {
                    divisions = 1024
                    unit = 'KB'
                } else {
                    divisions = 1
                    unit = 'Byte'
                }
                
                this.label.string = `更新中： ${(downloadedBytes/divisions).toFixed(2)}/${(totalBytes/divisions).toFixed(2)}${unit}`;
                console.log('VillV: ', this.label.string)
                break;
            
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('VillV: update finished')
                needRestart = true;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.UPDATE_FAILED:
            case jsb.EventAssetsManager.ERROR_UPDATING:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('VillV: error message', event.getMessage())
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this._updating = false;
                this._canRetry = true;
                console.log("VillV: no updating required")
                break;
            default:
                console.log("VillV event code: ", event.getEventCode())
                
        }

        if (failed) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
            alertComponent().setCallback(()=>{cc.game.restart();})
            alertError("更新失败，请重新进入游戏")
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            for (var i = 0; i < newPaths.length; i++) {
                if (searchPaths.indexOf(newPaths[i]) == -1) {
                    Array.prototype.unshift.apply(searchPaths, [newPaths[i]]);
                }
            }
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
        if(this._canRetry) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            this.byteProgress.progress = 0;
        }
    },
});