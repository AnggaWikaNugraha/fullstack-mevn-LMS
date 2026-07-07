import { Router } from 'express';
import { getQuestions, submitAnswers, getMyAttempt } from '../controllers/quizController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/:lessonId/questions', protect, getQuestions);
router.post('/:lessonId/submit', protect, submitAnswers);
router.get('/:lessonId/my-attempt', protect, getMyAttempt);

export default router;
