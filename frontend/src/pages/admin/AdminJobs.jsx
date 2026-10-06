// frontend/src/pages/admin/AdminJobs.jsx
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  X,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../../services/api'; // ✅ Import jobService
import './AdminJobs.css';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    description: '',
    requirements: [],
    benefits: [],
    isUrgent: false,
    status: 'Active',
    deadline: ''
  });
  const [requirementInput, setRequirementInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const departments = ['Engineering', 'Design', 'Marketing', 'HR', 'Management', 'Finance', 'Sales', 'Other'];
  const jobTypes = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'];

  // ✅ Fetch jobs using jobService
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [jobsRes, statsRes] = await Promise.all([
        jobService.getAdminJobs(),
        jobService.getJobStats()
      ]);
      
      if (jobsRes.success) {
        setJobs(jobsRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: '',
      experience: '',
      salary: '',
      description: '',
      requirements: [],
      benefits: [],
      isUrgent: false,
      status: 'Active',
      deadline: ''
    });
    setRequirementInput('');
    setBenefitInput('');
    setEditingJob(null);
  };

  // ✅ Handle Create/Update using jobService
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.requirements.length === 0) {
      toast.error('Please add at least one requirement');
      return;
    }
    
    try {
      let response;
      if (editingJob) {
        response = await jobService.updateJob(editingJob._id, formData);
      } else {
        response = await jobService.createJob(formData);
      }
      
      if (response.success) {
        toast.success(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
        setShowModal(false);
        resetForm();
        fetchJobs();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  // ✅ Handle Delete using jobService
  const handleDelete = async () => {
    try {
      const response = await jobService.deleteJob(showDeleteModal._id);
      if (response.success) {
        toast.success('Job deleted successfully');
        setShowDeleteModal(null);
        fetchJobs();
      } else {
        toast.error(response.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  // ✅ Handle Toggle Status using jobService
  const handleToggleStatus = async (id) => {
    try {
      const response = await jobService.toggleJobStatus(id);
      if (response.success) {
        toast.success(response.message);
        fetchJobs();
      } else {
        toast.error(response.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary || '',
      description: job.description,
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      isUrgent: job.isUrgent || false,
      status: job.status || 'Active',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      Active: { color: '#16a34a', bg: '#dcfce7' },
      Closed: { color: '#64748b', bg: '#f1f5f9' },
      Draft: { color: '#f59e0b', bg: '#fef3c7' }
    };
    const style = config[status] || config.Draft;
    return (
      <span className="status-badge" style={{ color: style.color, background: style.bg }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-jobs-loading">
        <Loader size={40} className="spinning" />
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="admin-jobs-container">
      {/* Header */}
      <div className="admin-jobs-header">
        <div>
          <h1>Job Openings</h1>
          <p>Manage all job listings</p>
        </div>
        <button 
          className="create-job-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          Create New Job
        </button>
      </div>

      {/* Stats */}
      <div className="admin-jobs-stats">
        <div className="stat-card">
          <Briefcase size={24} className="stat-icon blue" />
          <div>
            <span className="stat-number">{stats?.totalJobs || 0}</span>
            <span className="stat-label">Total Jobs</span>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} className="stat-icon green" />
          <div>
            <span className="stat-number">{stats?.activeJobs || 0}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <AlertCircle size={24} className="stat-icon red" />
          <div>
            <span className="stat-number">{stats?.urgentJobs || 0}</span>
            <span className="stat-label">Urgent</span>
          </div>
        </div>
        <div className="stat-card">
          <Eye size={24} className="stat-icon yellow" />
          <div>
            <span className="stat-number">{stats?.totalViews || 0}</span>
            <span className="stat-label">Total Views</span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="admin-jobs-toolbar">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={18} />
            </button>
          )}
        </div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Job List */}
      <div className="admin-jobs-list">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <Briefcase size={48} />
            <h3>No jobs found</h3>
            <p>Create your first job opening</p>
            <button 
              className="create-first-btn"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <Plus size={18} />
              Create New Job
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="admin-job-card">
              <div className="admin-job-card-header">
                <div className="job-info">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <span><Briefcase size={14} /> {job.department}</span>
                    <span><MapPin size={14} /> {job.location}</span>
                    <span><Clock size={14} /> {job.type}</span>
                    <span><DollarSign size={14} /> {job.salary || 'Negotiable'}</span>
                  </div>
                </div>
                <div className="job-actions">
                  <StatusBadge status={job.status} />
                  {job.isUrgent && (
                    <span className="urgent-badge">Urgent</span>
                  )}
                  <button 
                    className="action-btn toggle"
                    onClick={() => handleToggleStatus(job._id)}
                    title="Toggle status"
                  >
                    {job.status === 'Active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => openEditModal(job)}
                    title="Edit job"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => setShowDeleteModal(job)}
                    title="Delete job"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="admin-job-card-footer">
                <span><Calendar size={14} /> Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                {job.deadline && (
                  <span><Calendar size={14} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                )}
                <span><Eye size={14} /> {job.views || 0} views</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay job-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Full Stack Developer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Mohali, Punjab"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Experience *</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 3-5 years"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹10L - ₹15L PA"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the job role and responsibilities..."
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Requirements *</label>
                  <div className="tags-input">
                    <div className="tags-list">
                      {formData.requirements.map((req, index) => (
                        <span key={index} className="tag">
                          {req}
                          <button type="button" onClick={() => removeRequirement(index)}>
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="tags-input-row">
                      <input
                        type="text"
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        placeholder="Add a requirement..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      />
                      <button type="button" onClick={addRequirement} className="add-tag-btn">
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Benefits</label>
                  <div className="tags-input">
                    <div className="tags-list">
                      {formData.benefits.map((benefit, index) => (
                        <span key={index} className="tag benefit">
                          {benefit}
                          <button type="button" onClick={() => removeBenefit(index)}>
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="tags-input-row">
                      <input
                        type="text"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        placeholder="Add a benefit..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                      />
                      <button type="button" onClick={addBenefit} className="add-tag-btn">
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleChange}
                    />
                    Mark as Urgent
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Job</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="delete-content">
              <AlertCircle size={48} className="delete-icon" />
              <h3>Are you sure?</h3>
              <p>
                This will permanently delete <strong>"{showDeleteModal.title}"</strong>.
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(null)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                <Trash2 size={18} />
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}