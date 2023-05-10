const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getState);

router.route('/:stateCode/funfact')
    .get(statesController.getStateFunfact)
    .post(statesController.createNewFunfact)
    .patch(statesController.updateFunfact)
    .delete(statesController.deleteFunfact);

router.route('/:stateCode/capital')
    .get(statesController.getStateCapital);

router.route('/:stateCode/nickname')
    .get(statesController.getStateNickname);

router.route('/:stateCode/population')
    .get(statesController.getStatePopulation);

router.route('/:stateCode/admission')
    .get(statesController.getStateAdmission);

router.route('/:stateCode')
.get(statesController.getState);
// router.route('/:stateCode([a-zA-Z]{2})')
//     .get(statesController.getState);

module.exports = router;