import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import { getQuizQuestions, createQuestion, updateQuestion, deleteQuestion } from '../../controllers/admin/quizAdminController';

const router = Router();

router.use(protect, adminOnly);

router.get('/:lessonId/questions', getQuizQuestions);
router.post('/:lessonId/questions', createQuestion);
router.patch('/questions/:questionId', updateQuestion);
router.delete('/questions/:questionId', deleteQuestion);

export default router;
