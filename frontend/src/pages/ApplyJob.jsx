// frontend/src/pages/ApplyJob.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from "../services/api";
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  Upload,
  Send,
  ArrowLeft,
  CheckCircle,
  Loader,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../services/api';
import './ApplyJob.css';

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    availableTime: '',
    experience: '',
    resume: null,
    coverLetter: '',
    linkedin: '',
    portfolio: ''
  });

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM'
  ];

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      if (response.success) {
        setJob(response.data);
      } else {
        toast.error('Job not found');
        navigate('/careers');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      navigate('/careers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.availableTime) {
      toast.error('Please select your available time');
      return;
    }
    if (!formData.resume) {
      toast.error('Please upload your resume');
      return;
    }
    if (formData.resume && formData.resume.size > 5 * 1024 * 1024) {
      toast.error('Resume file size should be less than 5MB');
      return;
    }

    setSubmitting(true);
    
    try {
      // Create form data for file upload
      const submitData = new FormData();
      submitData.append('jobId', id);
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('availableTime', formData.availableTime);
      submitData.append('experience', formData.experience);
      submitData.append('coverLetter', formData.coverLetter);
      submitData.append('linkedin', formData.linkedin);
      submitData.append('portfolio', formData.portfolio);
      submitData.append('resume', formData.resume);

      // Send application - Replace with your actual API endpoint
      // In ApplyJob.jsx, update the submit URL
const response = await fetch(`${API_URL}/applications`, {
  method: 'POST',
  body: submitData
});

      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        toast.error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="apply-loading">
        <Loader size={48} className="spinning" />
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="apply-error">
        <AlertCircle size={48} />
        <h2>Job not found</h2>
        <p>The job you're looking for doesn't exist or has been removed.</p>
        <button className="back-btn" onClick={() => navigate('/careers')}>
          <ArrowLeft size={18} />
          Back to Careers
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="apply-success-container">
        <motion.div
          className="apply-success-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle size={64} className="success-icon" />
          <h1>Application Submitted! 🎉</h1>
          <p>
            Thank you for applying for the position of <strong>{job.title}</strong>.
            We'll review your application and get back to you soon.
          </p>
          <div className="success-details">
            <p><strong>Position:</strong> {job.title}</p>
            <p><strong>Department:</strong> {job.department}</p>
            <p><strong>Applied on:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button className="back-btn primary" onClick={() => navigate('/careers')}>
            <ArrowLeft size={18} />
            Back to Careers
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/careers')}>
          <ArrowLeft size={18} />
          Back to Careers
        </button>

        <div className="apply-grid">
          {/* Job Info */}
          <motion.div
            className="job-info-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="job-header">
              <h1>{job.title}</h1>
              <span className={`status-badge ${job.status?.toLowerCase() || 'active'}`}>
                {job.status || 'Active'}
              </span>
            </div>

            <div className="job-meta-details">
              <span><Briefcase size={16} /> {job.department}</span>
              <span><MapPin size={16} /> {job.location}</span>
              <span><Clock size={16} /> {job.type}</span>
              <span><DollarSign size={16} /> {job.salary || 'Negotiable'}</span>
            </div>

            <div className="job-description-preview">
              <h3>About this position</h3>
              <p>{job.description}</p>
            </div>

            <div className="job-requirements-preview">
              <h3>Requirements</h3>
              <ul>
                {job.requirements?.map((req, index) => (
                  <li key={index}>• {req}</li>
                ))}
              </ul>
            </div>

            <div className="job-benefits-preview">
              <h3>Benefits</h3>
              <ul>
                {job.benefits?.map((benefit, index) => (
                  <li key={index}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            className="application-form-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2>Apply Now</h2>
            <p className="form-subtitle">Fill in your details to apply for this position</p>

            <form onSubmit={handleSubmit} className="apply-form">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-wrapper">
               
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-wrapper">
                
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <div className="input-wrapper">
              
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. 3-5 years"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Available Interview Time *</label>
                <div className="input-wrapper">
                 
                  <select
                    name="availableTime"
                    value={formData.availableTime}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your available time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Upload Resume *</label>
                <div className="file-upload-wrapper">
                  <div className="file-upload-area">
                    <Upload size={24} />
                    <p>Click to upload or drag and drop</p>
                    <span>PDF, DOC, DOCX (Max 5MB)</span>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {formData.resume && (
                    <div className="file-name">
                      <CheckCircle size={16} />
                      <span>{formData.resume.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Portfolio / Website</label>
                <input
                  type="url"
                  name="portfolio"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Cover Letter</label>
                <textarea
                  name="coverLetter"
                  placeholder="Tell us why you're a great fit for this position..."
                  rows="4"
                  value={formData.coverLetter}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader size={20} className="spinning" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}