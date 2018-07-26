const rp = require('request-promise');

function search(s, type, offset) {
    type = type || 1;
    /*  歌曲 : 1
        專輯 : 10
        歌手 : 100
        歌單 : 1000
        用戶 : 1002
         MV : 1004 
        歌詞 : 1006
        電台 : 1009
    */

   offset = offset || 0;

   let options = {
    method: 'POST',
    uri: 'http://music.163.com/api/search/get',
    headers: {
        Cookie: 'appver=2.0.2',
        Referer: 'https://music.163.com'
    },
    qs: {
        s,
        type,
        offset,
        total: true,
        limit: 20
    },
    json: true
    };

    return rp(options)
}

function getLyric(id) {
    let options = {
        uri: 'https://music.163.com/api/song/lyric',
        qs: {
            os: 'pc',
            id: id,
            lv: -1,
            tv: -1
        },
        headers: {
            Cookie: 'appver=2.0.2',
            Referer: 'https://music.163.com'
        },
        json: true
    };
    
    return rp(options)
            .then(data => ({
                lrc: data.lrc.lyric,
                tlyric: data.tlyric.lyric,
                code: data.code
            }))
}

module.exports.search = search;
module.exports.getLyric = getLyric;