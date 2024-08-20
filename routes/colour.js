const express = require('express');
const router = express.Router();
const colourController = require('../controllers/colour');

router.get('/', colourController.getColours);

router.post('/', colourController.addColour);

router.put('/:colour/:direction', colourController.voteColour);

router.delete('/:colour', colourController.removeColour);

module.exports = router;
