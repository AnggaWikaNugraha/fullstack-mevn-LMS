import { Router } from 'express';
import { getBootcamps, getBootcampDetail } from '../controllers/bootcampController';

const router = Router();

router.get('/', getBootcamps);
router.get('/:id', getBootcampDetail);

export default router;
