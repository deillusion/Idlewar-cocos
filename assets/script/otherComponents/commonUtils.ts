
function fillWithZero(num: number, digits: number) {
    let zeros = "000000000000000000000000000"
    let numStr = num.toString()
    return zeros.substring(0, digits - numStr.length) + numStr
}

export {fillWithZero}