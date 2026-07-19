import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { adminOnly } from '../../middlewares/adminMiddleware';
import {
  listMentors,
  listPackages,
  getPackageDetail,
  createPackage,
  updatePackage,
  deletePackage,
  createBatch,
  updateBatch,
  deleteBatch,
  createSession,
  updateSession,
  deleteSession,
} from '../../controllers/admin/bootcampAdminController';

const router = Router();

router.use(protect, adminOnly);

// Mentor list — harus sebelum /:id agar tidak tertangkap sebagai param
router.get('/mentors', listMentors);

// Package CRUD
router.get('/', listPackages);
router.get('/:id', getPackageDetail);
router.post('/', createPackage);
router.patch('/:id', updatePackage);
router.delete('/:id', deletePackage);

// Batch
router.post('/:id/batches', createBatch);
router.patch('/batches/:id', updateBatch);
router.delete('/batches/:id', deleteBatch);

// Session
router.post('/batches/:id/sessions', createSession);
router.patch('/sessions/:id', updateSession);
router.delete('/sessions/:id', deleteSession);

export default router;
