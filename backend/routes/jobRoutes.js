import express from 'express';
import { 
  getJobs,
  getJobById,
  getAdminJobs,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getJobStats
} from '../controllers/jobController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.get('/', getJobs);

// ===== ADMIN ROUTES =====
router.get('/admin/all', protect, admin, getAdminJobs);
router.get('/admin/stats', protect, admin, getJobStats);
router.post('/', protect, admin, createJob);
router.put('/:id', protect, admin, updateJob);
router.delete('/:id', protect, admin, deleteJob);
router.patch('/:id/toggle-status', protect, admin, toggleJobStatus);

// Keep dynamic ID routes after fixed paths such as /admin/all and /admin/stats.
router.get('/:id', getJobById);

export default router;