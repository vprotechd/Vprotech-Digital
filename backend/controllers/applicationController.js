// backend/controllers/applicationController.js
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import cloudinary from '../config/cloudinary.js';

// ===== PUBLIC CONTROLLERS =====

// @desc    Submit job application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req, res) => {
  try {
    const { 
      jobId, 
      name, 
      email, 
      phone, 
      availableTime, 
      experience, 
      coverLetter, 
      linkedin, 
      portfolio 
    } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if already applied (optional - prevent duplicate applications)
    const existingApplication = await Application.findOne({ 
      jobId, 
      email: email.toLowerCase() 
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position'
      });
    }

    // Handle resume file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume is required'
      });
    }

    const resumeFormat = path.extname(req.file.originalname).slice(1).toLowerCase();
    const resumePublicId = `resume-${randomUUID()}.${resumeFormat}`;
    let resumeUpload;
    try {
      resumeUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'vprotech/resumes',
            public_id: resumePublicId,
            resource_type: 'raw',
            type: 'authenticated',
            use_filename: false,
            unique_filename: false,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (!result?.public_id || !result.secure_url) {
              reject(new Error('Resume storage did not return a valid file reference'));
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(req.file.buffer);
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      return res.status(502).json({
        success: false,
        message: 'Failed to store resume. Please try again.'
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      name,
      email: email.toLowerCase(),
      phone,
      availableTime,
      experience,
      coverLetter,
      linkedin,
      portfolio,
      resume: resumeUpload.secure_url,
      resumePublicId: resumeUpload.public_id,
      resumeFormat,
      status: 'pending'
    });

    // Increment applications count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ===== ADMIN CONTROLLERS =====

// @desc    Get all applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Build query
    const query = { jobId };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/applications/all
// @access  Private/Admin
export const getAllApplications = async (req, res) => {
  try {
    const { status, jobId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (jobId) query.jobId = jobId;

    const applications = await Application.find(query)
      .populate('jobId', 'title department location type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private/Admin
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title department location type');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Mark as viewed
    application.viewed = true;
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Download an applicant resume
// @route   GET /api/applications/:id/resume
// @access  Private/Admin
export const downloadApplicationResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .select('resume resumePublicId resumeFormat name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (!application.resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume is attached to this application'
      });
    }

    const applicantName = application.name.replace(/[^a-z0-9-_]/gi, '-');

    if (application.resumePublicId) {
      const format = application.resumeFormat || path.extname(application.resume).slice(1);
      const downloadUrl = cloudinary.utils.private_download_url(
        application.resumePublicId,
        format,
        {
          resource_type: 'raw',
          type: 'authenticated',
          attachment: `${applicantName}-resume.${format}`,
        },
      );
      const resumeResponse = await fetch(downloadUrl);

      if (!resumeResponse.ok || !resumeResponse.body) {
        console.error('Cloudinary resume download failed:', resumeResponse.status);
        return res.status(502).json({
          success: false,
          message: 'Resume storage is temporarily unavailable'
        });
      }

      res.setHeader(
        'Content-Type',
        resumeResponse.headers.get('content-type') || 'application/octet-stream',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${applicantName}-resume.${format}"`,
      );
      await pipeline(Readable.fromWeb(resumeResponse.body), res);
      return;
    }

    const storedFilename = path.basename(application.resume.replace(/\\/g, '/'));
    const resumePath = path.resolve(process.cwd(), 'uploads', 'resumes', storedFilename);
    const resumeDirectory = path.resolve(process.cwd(), 'uploads', 'resumes');

    if (path.dirname(resumePath) !== resumeDirectory) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resume path'
      });
    }

    try {
      await access(resumePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'Resume file is no longer available'
      });
    }

    const extension = path.extname(storedFilename);
    return res.download(resumePath, `${applicantName}-resume${extension}`);
  } catch (error) {
    console.error('Download application resume error:', error);
    if (res.headersSent) {
      res.destroy(error);
      return;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to download resume'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private/Admin
export const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Application.countDocuments();
    
    const result = {
      total,
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0
    };

    stats.forEach(item => {
      if (item._id in result) {
        result[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      stats: result
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};