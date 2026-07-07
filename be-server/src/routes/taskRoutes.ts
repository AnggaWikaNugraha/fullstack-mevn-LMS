import { Router } from 'express';
import { submitTask, getMySubmission } from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/:lessonId/submit', protect, submitTask);
router.get('/:lessonId/my-submission', protect, getMySubmission);

export default router;
