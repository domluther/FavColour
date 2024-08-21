import express from 'express';
const router = express.Router();
import * as rootController from '../controllers/index.js';

router.get('/', rootController.getIndex);

export default router;
