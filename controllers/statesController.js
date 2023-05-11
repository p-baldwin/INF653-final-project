const { da } = require('date-fns/locale');
const isValidStateCode = require('../middleware/isValidStateCode');

const statesData = {
    states: require('../model/statesData.json'),
    setStatesData: function(statesData) { this.states = statesData }
}

const States = require('../model/States');
const { options, all } = require('../routes/root');

const createNewFunfact = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    if(!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }

    try {
        const stateCode = req.params.stateCode;
        const funFacts = req.body.funfacts;

        let state = await States.findOne({ stateCode: stateCode }).exec();
        if(!state) {
            state = await States.create({ stateCode: stateCode });
        }

        funFacts.forEach(funfact => {
            state.funfacts.push(funfact);
        });

        result = await state.save();
        res.status(201).json(result);
    } catch(err) {
        console.error(err);
    }
}

const updateFunfact = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    if(!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    if(!req?.body?.funfact) {
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }

    try {
        const stateCode = req.params.stateCode.toUpperCase();
        const idx = req.body.index - 1;
        const funFact = req.body.funfact;
        const stateName = statesData.states.find(state => state.code === stateCode);
        const state = await States.findOne({ stateCode: stateCode }).exec();

        if(!state.funfacts) {
            return res.status(400).json({ 'message': `No Fun Facts found for ${stateName.stateName}` });
        }

        if(!state.funfacts.at(idx)) {
            return res.status(400).json({ 'message': `No Fun Fact found at that index for ${stateName.stateName}` });
        }

        state.funfacts.set(idx, funFact);
        const result = await state.save();

        res.status(201).json(result);
    } catch(err) {
        console.error(err);
    }
}

const deleteFunfact = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    if(!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }

    const idx = req.body.index - 1;
    const state = await States.findOne({ stateCode: req.params.stateCode }).exec();

    const funFact = await state.funfacts.splice(idx);
    const result = await state.save();
    res.json(result);
}

const getState = async (req, res) => {
    const allStatesData = statesData.states;
    const stateFunfacts = await States.find({}).exec();

    allStatesData.forEach(stateData => {
        stateData.funfacts = [];
        stateFunfacts.forEach(stateFunfact => {
            if(stateData.code === stateFunfact.stateCode) {
                stateData.funfacts = stateFunfact.funfacts;
            }
        });
    });

    if(req?.query?.contig) {
        if(req.query.contig === "false") {
            return res.json(allStatesData.filter(state => ((state.code === 'AK') || (state.code === 'HI'))));
        } else {
            return res.json(allStatesData.filter(state => ((state.code !== 'AK') && (state.code !== 'HI'))));
        }
    }

    if(req.params.stateCode) {
        const stateCode = req.params.stateCode.toUpperCase();
        if(!isValidStateCode(stateCode)) {
            return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
        }
        return res.json(allStatesData.find(state => state.code === stateCode));
    }

    res.json(allStatesData);
}

const getStateFunfact = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    stateCode = req.params.stateCode.toUpperCase();
    const state = await States.findOne({ stateCode: stateCode }).exec();
    if(!state) {
        const stateData = statesData.states.find(state => state.code === stateCode);
        return res.json({ "message": `No Fun Facts found for ${stateData.state}` })
    }

    const idx = Math.floor(Math.random() * state.funfacts.length);
    const funFact = await state.funfacts[idx];
    res.json({ "funfact": funFact });

}
const getStateCapital = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    stateCode = req.params.stateCode.toUpperCase();
    const stateData = statesData.states.find(state => state.code === stateCode);
    res.json( { 'state': stateData.state, 'capital': stateData.capital_city })
}

const getStateNickname = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    stateCode = req.params.stateCode.toUpperCase();
    const stateData = statesData.states.find(state => state.code === stateCode);
    res.json( { 'state': stateData.state, 'nickname': stateData.nickname })
}

const getStatePopulation = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    stateCode = req.params.stateCode.toUpperCase();
    const stateData = statesData.states.find(state => state.code === stateCode);
    res.json( { 'state': stateData.state, 'population': stateData.population.toLocaleString('en-US') });
}

const getStateAdmission = async (req, res) => {
    if(!isValidStateCode(req.params.stateCode)) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter"});
    }

    stateCode = req.params.stateCode.toUpperCase();
    const stateData = statesData.states.find(state => state.code === stateCode);
    res.json( { 'state': stateData.state, 'admitted': stateData.admission_date })
}
module.exports = {
    // getAllStates,
    createNewFunfact,
    updateFunfact,
    deleteFunfact,
    getState,
    getStateFunfact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission
}