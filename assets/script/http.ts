import { alertServerError, loadingView, completeLoading, alertComponent } from "./otherComponents/uiUtils";
import { user, auth } from './Globals'
import { fetch } from './netComponenents/fetch'
const uri = "https://www.idlewar.online";


let sendPostForms = function(urlApi,paramJson,callback, config: any = {}){
    loadingView();
    var url=uri + handleApi(urlApi) + url_suffix();
    let param = JSON.stringify(paramJson)
    send_request(url, {method: 'POST', body: param}, callback, config)
}
let sendGetForms = function(urlApi,paramJson,callback, config: any = {}){
    if(!config.noLoadingView) loadingView();
    //console.log("get forms sent")
    //console.log(urlApi, handleApi(urlApi))
    var url=uri + handleApi(urlApi) + url_suffix() + params_str(paramJson);
    send_request(url, {method: 'GET'}, callback, config)
}

export {
    sendGetForms,
    sendPostForms
}

function handleApi(urlApi: string) {
    let start = urlApi.charAt(0)
    if(start != "/" && start != ":") return "/" + urlApi
    return urlApi
}

var send_request = function(url, body: RequestInit, callback, config) {
    body.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':"*"
    }
    //@ts-ignore
    fetch(url, body)
        .then(async function(response){
            if(response.status == 200){
                return response.json()
            } else if(response.status == 401) {
                cc.sys.localStorage.removeItem("auth")
                alertComponent().setCallback(() => cc.director.loadScene('Login'))
                throw new Error(await response.text());
            } else {
                
                if(!config.noAlert) {
                    throw new Error(await response.text());
                } else {
                    return {"str": await response.text()}
                }
                
            }          
        })
        .then(function(response){
            completeLoading()
            let res = response
            //TODO: 后端将所有text全部替换为json化的string object
            if(res['str'] || res['str'] == "") {
                return res['str']
            } else {
                return res
            }
        })
        .then(callback)
        .catch(function(err: Error){      
            console.error(err)
            completeLoading();
            //callback(null,err)
            alertServerError(err);
        })  
}

function responseCallback(xhr,callback){
    var alert=true;
    console.log('connecting');
    xhr.onreadystatechange=function(){
        console.log(xhr.statusText);
        if(xhr.readyState==4&&(xhr.status>=200&&xhr.status<=207)){
            alert=false;
            var httpStatus=xhr.statusText;
            var response=xhr.responseText;
            callback(response);
        }
    }
    setTimeout(function(){
        if(alert){
            callback(JSON.stringify({success:false,res:"错误:网络异常"}));
        }
    },5000);
}

function sendPostForms2(urlApi,paramJson,callback){
    //URL未设置
    var xhr=new XMLHttpRequest();
    responseCallback(xhr,callback);
    xhr.timeout=5000;
    xhr.open("POST","http://106.52.82.57:8000"+"/"+urlApi);
    xhr.setRequestHeader("Content-Type","application/json");
    if (cc.sys.isNative){
        console.log('isNative');
        //xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
    }
    var args='';
    for(var i=0;i<paramJson.length;i++){
        cc.log(paramJson[i]);
        args+=paramJson[i].key+"="+paramJson[i].value+"&";
    }
    xhr.send(JSON.stringify(paramJson));
}

function urlEncode(str: string)
{
    var strSpecial = "%!\"#$&’()*+,/:;<=>?[]^`{|}~";
    for(var i = 0; i < str.length; i++)
    {
        var chr = str.charAt(i);
        var c = str.charCodeAt(i);
        if(strSpecial.includes(chr))
        str = str.replace(chr, "%" + c.toString(16))
    }
    return str;
}

var url_suffix = function() {
    let token = urlEncode(generatePassport())
    let token2 = urlEncode(auth.token)
    return `?userid=${auth.userid}&token=${token}&token2=${token2}`
}

var params_str = function(paramJson) {
    var args='';
    for(let key in paramJson){
        args += "&" + key + "=" + paramJson[key];
    }
    return args.substring(0,-1)
}

import CryptoJS = require("crypto-js")


function aesEncryption(value, key = "he4wfewscaed1f3q", iv = "LingJAlgorithmic") {
    value = value.toString()
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv)
    const encrypted = CryptoJS.AES.encrypt(value, key, { iv, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

function generatePassport() {
    let timestamp = Math.floor(new Date().valueOf()/1000)
    let salt = randInt(7)*39 + randInt(5)
    let passValue = timestamp * 913 + salt
    return aesEncryption(passValue)
}

function randInt(n) { return Math.floor(Math.random()*n) }

