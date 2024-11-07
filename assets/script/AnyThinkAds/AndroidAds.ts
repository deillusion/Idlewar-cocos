import { user } from "../Globals";
import { completeLoading, danMu } from "../otherComponents/uiUtils";

const SPACES = {
    addGem: {
        placementId: 1036939,

    },
    enterJourney: {
        placementId: 1036941
    }
}

function runTaptapAds(spaceName: string, data: string, callback) {
    let placementId: number = SPACES[spaceName].placementId;
    //console.log("VillV placementId: ", placementId)
    jsb.reflection.callStaticMethod(
        "org/cocos2dx/javascript/TapADNActivity", "fetchAds", "(ILjava/lang/String;ILjava/lang/String;Ljava/lang/String;)V",
        placementId, "", 0, data, user.userid.toString()
    )
    //console.log("VillV: adn played ")
    let fn = () => {
        let o: string = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/TapADNActivity", "getPlayAdsResult", "()Ljava/lang/String;")
        if(!o || o.length == 0) {
            setTimeout(fn, 200)
            return
        }
        if(o == "success") {
            callback(true)
        } else {
            callback(false)
            danMu(o) 
        }
        //completeLoading()
    }
    setTimeout(fn, 200)
}

export {
    runTaptapAds
}