// components/career/JobOpenings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  ChevronDown,
  Search,
  Filter,
  X,
  Users,
  Award,
  TrendingUp,
  Zap,
  Sparkles,
  ArrowRight,
  Loader,
  IndianRupee
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService } from '../../services/api'; // ✅ Import jobService
import './JobOpenings.css';

export default function JobOpenings() {
const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [expandedJob, setExpandedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const departments = ['All', 'Engineering', 'Design', 'Marketing', 'HR', 'Management', 'Finance', 'Sales'];
  const jobTypes = ['All', 'Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'];

  // ✅ Fetch jobs from API using jobService
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs(); // ✅ Use jobService
      
      if (response.success) {
        setJobs(response.data);
      } else {
        toast.error('Failed to load jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error(error.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesDepartment && matchesType;
  });

  const toggleJobExpand = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All');
    setSelectedType('All');
  };

  // Calculate stats
  const totalJobs = jobs.length;
  const urgentJobs = jobs.filter(job => job.isUrgent).length;

  if (loading) {
    return (
      <section className="job-openings-section">
        <div className="job-openings-container">
          <div className="loading-container">
            <Loader size={48} className="spinning" />
            <p>Loading jobs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="job-openings-section">
      <div className="job-openings-container">
        {/* Section Header */}
        <motion.div
          className="job-openings-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="section-tag">CAREER OPPORTUNITIES</span>
          <h2 className="section-title">
            Current <span className="highlight">Job Openings</span>
          </h2>
          <p className="section-description">
            Join our team and be part of something amazing. We're looking for talented 
            individuals who are passionate about technology and innovation.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="job-stats-bar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="stat-item">
            <Briefcase size={22} />
            <span className="stat-number">{totalJobs}</span>
            <span className="stat-label">Open Positions</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Zap size={22} />
            <span className="stat-number">{urgentJobs}</span>
            <span className="stat-label">Urgent Hiring</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Users size={22} />
            <span className="stat-number">12+</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Award size={22} />
            <span className="stat-number">95%</span>
            <span className="stat-label">Employee Satisfaction</span>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="job-filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs by title, department, or location..."
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

          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={16} className={showFilters ? 'rotate' : ''} />
          </button>
        </motion.div>

        {/* Filter Dropdowns */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filter-dropdowns"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filter-group">
                <label>Department</label>
                <div className="filter-options">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      className={`filter-option ${selectedDepartment === dept ? 'active' : ''}`}
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>Job Type</label>
                <div className="filter-options">
                  {jobTypes.map((type) => (
                    <button
                      key={type}
                      className={`filter-option ${selectedType === type ? 'active' : ''}`}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="results-count">
          <span>Showing {filteredJobs.length} of {totalJobs} positions</span>
        </div>

        {/* Job Cards */}
        <motion.div
          className="job-cards-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                className={`job-card ${expandedJob === job._id ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="job-card-header" onClick={() => toggleJobExpand(job._id)}>
                  <div className="job-info">
                    <div className="job-title-wrapper">
                      <h3 className="job-title">{job.title}</h3>
                      {job.isUrgent && (
                        <span className="urgent-badge">
                          <Zap size={14} />
                          Urgent
                        </span>
                      )}
                      <span className={`status-badge ${job.status?.toLowerCase() || 'active'}`}>
                        {job.status || 'Active'}
                      </span>
                    </div>
                    <div className="job-meta">
                      <span className="meta-item">
                        <Briefcase size={16} />
                        {job.department}
                      </span>
                      <span className="meta-item">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className="meta-item">
                        <Clock size={16} />
                        {job.type}
                      </span>
                      <span className="meta-item">
                       <IndianRupee size={16} />
                        {job.salary || 'Negotiable'}
                      </span>
                    </div>
                  </div>
                  <div className="job-expand-icon">
                    <ChevronRight size={24} className={expandedJob === job._id ? 'rotate' : ''} />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedJob === job._id && (
                    <motion.div
                      className="job-card-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="job-description">
                        <p>{job.description}</p>
                      </div>

                      <div className="job-details-grid">
                        <div className="detail-section">
                          <h4>Requirements</h4>
                          <ul>
                            {job.requirements?.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="detail-section">
                          <h4>Benefits</h4>
                          <ul>
                            {job.benefits?.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="job-footer">
                        <div className="job-deadline">
                          <Clock size={16} />
                          <span>Apply by: {job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Open until filled'}</span>
                        </div>
                     
<button 
  className="apply-btn"
  onClick={() => navigate(`/apply/${job._id}`)}
>
  Apply Now
  <ArrowRight size={18} />
</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="no-jobs">
              <Briefcase size={48} />
              <h3>No positions found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}