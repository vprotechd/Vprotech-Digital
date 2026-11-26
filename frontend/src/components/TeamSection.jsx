// components/TeamSection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail,
  Globe,
  Edit,
  Trash2,
  Plus,
  X
} from 'lucide-react';

// Import social icons from react-icons (since lucide-react v1.24.0 doesn't have them)
import { 
  FaLinkedin, 
  FaGithub, 
  FaTwitter 
} from 'react-icons/fa';

import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './TeamSection.css';

export default function TeamSection() {
  const { 
    members, 
    groupedMembers, 
    loading, 
    error,
    fetchTeamMembers,
    deleteTeamMember,
    toggleTeamMemberStatus 
  } = useTeam();
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);

  const departments = [
    'all',
    'Leadership',
    'Development',
    'Marketing & Design',
    'Mechanical Team',
    'HR',
    'Management'
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      toast.success('Team member deleted successfully');
      setShowDeleteModal(null);
      fetchTeamMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete team member');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleTeamMemberStatus(id);
      toast.success('Status updated successfully');
      setShowStatusModal(null);
      fetchTeamMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getFilteredMembers = () => {
    if (selectedDepartment === 'all') {
      return members || [];
    }
    return groupedMembers[selectedDepartment] || [];
  };

  const filteredMembers = getFilteredMembers();

  if (loading) {
    return (
      <div className="team-loading">
        <div className="spinner"></div>
        <p>Loading our team...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-error">
        <p>{error}</p>
        <button onClick={() => fetchTeamMembers()}>Retry</button>
      </div>
    );
  }

  return (
    <section className="team-section">
      <div className="team-container">
        <motion.div
          className="team-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
         
          <h2>The People <span className="gradient-text">Powering</span> VproTech Digital</h2>
          <p>Meet the talented individuals behind our success</p>
          
          {isAdmin && (
            <Link to="/admin/team/create" className="add-member-btn">
              <Plus size={20} />
              Add Team Member
            </Link>
          )}
        </motion.div>

        {/* Department Filters */}
        <div className="department-filters">
          {departments.map((dept) => (
            <button
              key={dept}
              className={`filter-btn ${selectedDepartment === dept ? 'active' : ''}`}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept === 'all' ? 'All Teams' : dept}
            </button>
          ))}
        </div>

        {/* Team Grid */}
        {filteredMembers.length === 0 ? (
          <div className="no-members">
            <p>No team members found in this department.</p>
            {isAdmin && (
              <Link to="/admin/team/create" className="add-member-btn">
                <Plus size={20} />
                Add Your First Team Member
              </Link>
            )}
          </div>
        ) : (
          <div className="team-grid">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member._id}
                className={`team-card ${!member.isActive ? 'inactive-member' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="team-card-image">
                  <img
                    src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4F46E5&color=fff&size=200`}
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4F46E5&color=fff&size=200`;
                    }}
                  />
                  {member.featured && (
                    <span className="featured-badge">⭐ Featured</span>
                  )}
                  {!member.isActive && (
                    <div className="inactive-overlay">
                      <span>Inactive</span>
                    </div>
                  )}
                  
                  {/* Admin Actions - Visible on Hover */}
                  {isAdmin && (
                    <div className="admin-card-actions">
                      <Link 
                        to={`/admin/team/edit/${member._id}`}
                        className="admin-action-btn edit"
                        title="Edit Member"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="admin-action-btn toggle"
                        onClick={() => setShowStatusModal(member._id)}
                        title={member.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {member.isActive ? '🔴' : '🟢'}
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => setShowDeleteModal(member._id)}
                        title="Delete Member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="team-card-content">
                  <h3>{member.name}</h3>
                  <p className="designation">{member.designation}</p>
                  <span className="department-tag">{member.department}</span>
                  
                  {member.bio && (
                    <p className="bio">{member.bio.substring(0, 80)}...</p>
                  )}

                  {member.skills && member.skills.length > 0 && (
                    <div className="skills">
                      {member.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="skill-tag more">+{member.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="social-links">
                    {member.socialLinks?.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin size={16} />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub size={16} />
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter size={16} />
                      </a>
                    )}
                    {member.socialLinks?.portfolio && (
                      <a href={member.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                        <Globe size={16} />
                      </a>
                    )}
                    {/* <a href={`mailto:${member.email}`}>
                      <Mail size={16} />
                    </a> */}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowDeleteModal(null)}>
                <X size={24} />
              </button>
              <h3>Delete Team Member</h3>
              <p>Are you sure you want to delete this team member? This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowDeleteModal(null)}>
                  Cancel
                </button>
                <button className="delete-btn" onClick={() => handleDelete(showDeleteModal)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Toggle Modal */}
        {showStatusModal && (
          <div className="modal-overlay" onClick={() => setShowStatusModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowStatusModal(null)}>
                <X size={24} />
              </button>
              <h3>Toggle Status</h3>
              <p>
                Are you sure you want to {members.find(m => m._id === showStatusModal)?.isActive ? 'deactivate' : 'activate'} 
                this team member?
              </p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowStatusModal(null)}>
                  Cancel
                </button>
                <button className="confirm-btn" onClick={() => handleToggleStatus(showStatusModal)}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}