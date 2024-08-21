import express from 'express';
const router = express.Router();
import * as colourController from '../controllers/colour.js';

router.get('/', colourController.getColours);

router.post('/', colourController.addColour);

router.put('/:colour/:direction', colourController.voteColour);

router.delete('/:colour', colourController.removeColour);

export default router;
