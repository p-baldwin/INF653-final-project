const isValidStateCode = (stateCode, states) => {

    const abbreviations = states.find(stateCode);

    if(!abbreviations) return false;
    return true;
}

module.exports = isValidStateCode;