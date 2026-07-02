import { Router } from 'express';
import { getCourses, getTopics } from '../controllers/courseController';

const router = Router();

router.get('/', getCourses);
router.get('/topics', getTopics);

export default router;
