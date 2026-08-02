import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import { listTopics, createTopic, updateTopic, deleteTopic } from '../../controllers/admin/topicAdminController';

const router = Router();

router.use(protect, adminOnly);

router.get('/', listTopics);
router.post('/', createTopic);
router.patch('/:id', updateTopic);
router.delete('/:id', deleteTopic);

export default router;
