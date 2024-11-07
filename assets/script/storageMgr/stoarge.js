module.exports = {
  get_game_records: function(roomid){
    return getItem("room:history:"+roomid).split(",")
  },
  set_game_records: function(roomid, records) {
    setItem("room:history:"+roomid, records.join(","))
  },
  get_game_info: function(roomid){
    return JSON.parse(getItem('room:info:'+roomid))
  },
  set_game_info: function(roomid, obj){
    setItem("room:info:"+roomid, JSON.stringify(obj))
  },
  get_user_data: function(userid) {
    return JSON.parse(getItem("user:"+userid))
  },
  set_user_data: function(userid, obj) {
    setItem("user:"+userid, JSON.stringify(obj))
  },
  get_password: function() { return getItem("password") },
  set_password: function(psw) { setItem("password", psw) },
  get_userid: function() { return getItem("userid") },
  set_userid: function(id) { setItem("userid", id) }
}

var getItem = function(key) {
  return cc.sys.localStorage.getItem(key)
}

var setItem = function(key, value) {
  cc.sys.localStorage.setItem(key, value)
}