const units = [
    [1, ""],
    [1e3, "K"],
    [1e6, "M"],
    [1e9, "B"],
    [1e12, "AA"],
    [1e15, "BB"],
    [1e18, "CC"],
    [1e21, "DD"],
    [1e24, "EE"],
    [1e27, "FF"],
    [1e30, "GG"],
    [1e33, "HH"],
    [1e36, "II"],
    [1e39, "JJ"],
    [1e42, "KK"],
    [1e45, "LL"],
    [1e48, "MM"],
    [1e51, "NN"],
    [1e54, "OO"],
    [1e57, "PP"],
    [1e60, "QQ"],
]

function displayNumber(n) {
    n = Math.floor(n)

    if (n < 1) return "0"

    let unitToUse = units[0]
    for (let unit of units) {
        if (unit[0] < n) unitToUse = unit
        else break
    }

    let digits = (n / unitToUse[0]).toPrecision(3)

    return digits + unitToUse[1]
}

module.exports = {
    displayNumber,
}
