// backend/routes/applicationRoutes.js
import express from 'express';
import multer from 'multer';
import {
  submitApplication,
  getApplicationsByJob,
  getAllApplications,
  getApplicationById,
  downloadApplicationResume,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// ===== PUBLIC ROUTES =====

// Submit application (public)
router.post('/', upload.single('resume'), submitApplication);

// ===== ADMIN ROUTES =====

// Get all applications
router.get('/all', protect, admin, getAllApplications);

// Get application stats
router.get('/stats', protect, admin, getApplicationStats);

// Get applications by job
router.get('/job/:jobId', protect, admin, getApplicationsByJob);

// Download route must precede the general application ID route.
router.get('/:id/resume', protect, admin, downloadApplicationResume);

// Get single application
router.get('/:id', protect, admin, getApplicationById);

// Update application status
router.put('/:id/status', protect, admin, updateApplicationStatus);

// Delete application
router.delete('/:id', protect, admin, deleteApplication);

export default router;