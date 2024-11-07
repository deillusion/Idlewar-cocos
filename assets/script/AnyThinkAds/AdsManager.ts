import { runTaptapAds } from "./AndroidAds";

function runAds(spaceName: string, data: string, callback) {
    switch(cc.sys.os) {
        case cc.sys.OS_ANDROID : {
            runTaptapAds(spaceName, data, callback)
            break
        }
        case cc.sys.OS_IOS:
            break
        default:
            break
    }
    
}

export {
    runAds
}