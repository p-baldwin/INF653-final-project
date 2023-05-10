const isValidStateCode = (stateCode) => {
    return stateCode.length === 2;
}

module.exports = isValidStateCode;