const netease = require('../modules/netease.js')

function search(s){
    s = s || 'ユー&アイ'
    return netease.search(s).then(x => console.log(x.result.songs))
}

// search()

function getLyric(id){
    id = id || 494642639;
    return netease.getLyric(id).then(console.log)
}

getLyric()