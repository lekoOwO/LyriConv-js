function migrate(org, t, offset = 10 ** -3) {
    const isDigit = x => !isNaN(Number(x))
    const add = (num1, num2) => { // 精準加法
        let num1Digits = (num1.toString().split('.')[1] || '').length;
        let num2Digits = (num2.toString().split('.')[1] || '').length;
        let baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
      }
    const strip = (x,precision=12) => +parseFloat(x.toPrecision(precision))  // 數字精確化

    
    const tagToTime = tag => isDigit(tag[0]) ? tag.split(':').reverse().reduce((acc, cur, index) => add(acc, Number(cur)*(60**index)), 0) : tag
    const parse = (x, isTranslated=false) => x.split("\n").filter(x => x!='').map(x => /\[(.+?)\](.*)/g.exec(x)).map(x => [tagToTime(x[1]), x[2], isTranslated])
    const timeToTag = seconds => new Date(1000 * seconds).toISOString().slice(11, -1);
    
    
    // 開始切成 [(tag, lyric)]

    parsedLyrics = parse(org).concat(parse(t, true)).sort((a, b) => {
        if (typeof(a[0]) == typeof(b[0]) == 'string') return 0
        else if (typeof(a[0]) == 'string') return -1
        else if (typeof(b[0]) == 'string') return 1
        else {
            if (a[0] == b[0]) return a[2] ? 1 : -1
            else return a[0] < b[0] ? -1 : 1 
        }
    })

    // 整理成 [[time, [orgLyric, tLyric]]]
    let parsedLyricPairs= [], i = 0
    while(i < parsedLyrics.length) { 
        if (typeof(parsedLyrics[i][0]) == 'string') {
            parsedLyricPairs.push(parsedLyrics[i])
            i += 1
        }
        else if (i != parsedLyrics.length -1){
            if (parsedLyrics[i][0] == parsedLyrics[i+1][0]) {
                parsedLyricPairs.push([parsedLyrics[i][0], [parsedLyrics[i][1], parsedLyrics[i+1][1]]])
                i += 2
            }
            else {
                parsedLyricPairs.push([parsedLyrics[i][0], [parsedLyrics[i][1], parsedLyrics[i][1]]])
                i += 1
            }
        }
        else {
            parsedLyricPairs.push([parsedLyrics[i][0], [parsedLyrics[i][1], parsedLyrics[i][1]]])
            i += 1
        }
    }

    // 壓回 LRC
    let result = ''
    for (let i in parsedLyricPairs) {
        i = Number(i)
        if (typeof(parsedLyricPairs[i][0]) == 'string') result += `[${parsedLyricPairs[i][0]}]\n`
        else {
            if (i != parsedLyricPairs.length -1) result += `[${timeToTag(parsedLyricPairs[i][0])}]${parsedLyricPairs[i][1][0]}\n[${timeToTag(add(parsedLyricPairs[i+1][0], -offset))}]${parsedLyricPairs[i][1][1]}\n`
            else result += `[${timeToTag(parsedLyricPairs[i][0])}]${parsedLyricPairs[i][1][0]}\n[${timeToTag(parsedLyricPairs[i][0])}]${parsedLyricPairs[i][1][1]}\n`
        }
    }
    
    return result
}