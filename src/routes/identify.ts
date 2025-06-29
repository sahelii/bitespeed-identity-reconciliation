import { Router } from 'express';
import { identifyContact } from '../controllers/identifyController';

const router = Router();

// POST /identify - Identify and link contacts
router.post('/', identifyContact);

export const identifyRouter = router; 