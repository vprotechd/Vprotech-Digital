// pages/admin/TeamForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../../context/TeamContext';
import { DEPARTMENTS, DESIGNATIONS, SKILLS } from '../../constants/departments';
import { FaUpload, FaTimes, FaSave, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './TeamForm.css';

const TeamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { 
    selectedMember, 
    loading, 
    error, 
    fetchTeamMemberById, 
    createTeamMember, 
    updateTeamMember 
  } = useTeam();

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    email: '',
    phone: '',
    bio: '',
    experience: '',
    skills: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      portfolio: ''
    },
    isActive: true,
    featured: false,
    order: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchTeamMemberById(id);
    }
  }, [id, isEditing, fetchTeamMemberById]);

  useEffect(() => {
    if (selectedMember && isEditing) {
      setFormData({
        name: selectedMember.name || '',
        designation: selectedMember.designation || '',
        department: selectedMember.department || '',
        email: selectedMember.email || '',
        phone: selectedMember.phone || '',
        bio: selectedMember.bio || '',
        experience: selectedMember.experience || '',
        skills: selectedMember.skills || [],
        socialLinks: {
          linkedin: selectedMember.socialLinks?.linkedin || '',
          github: selectedMember.socialLinks?.github || '',
          twitter: selectedMember.socialLinks?.twitter || '',
          portfolio: selectedMember.socialLinks?.portfolio || ''
        },
        isActive: selectedMember.isActive ?? true,
        featured: selectedMember.featured ?? false,
        order: selectedMember.order || 0,
        joinedDate: selectedMember.joinedDate ? new Date(selectedMember.joinedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
      if (selectedMember.image) {
        setImagePreview(selectedMember.image);
      }
    }
  }, [selectedMember, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // pages/admin/TeamForm.jsx - Update handleAddSkill

const handleAddSkill = () => {
  const trimmedSkill = skillInput.trim();
  if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill]
    }));
    setSkillInput('');
  }
};

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // pages/admin/TeamForm.jsx - Fixed handleSubmit
// pages/admin/TeamForm.jsx - Updated handleSubmit

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoadingSubmit(true);

  try {
    // ✅ FIX: Clean skills array - remove empty strings and duplicates
    const cleanSkills = formData.skills
      .filter(skill => skill && skill.trim() !== '')
      .map(skill => skill.trim());

    // Prepare data as JSON
    const data = {
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
      email: formData.email,
      phone: formData.phone || '',
      bio: formData.bio || '',
      experience: formData.experience || '',
      skills: cleanSkills,  // ✅ Use cleaned skills
      socialLinks: {
        linkedin: formData.socialLinks.linkedin || '',
        github: formData.socialLinks.github || '',
        twitter: formData.socialLinks.twitter || '',
        portfolio: formData.socialLinks.portfolio || '',
      },
      isActive: formData.isActive,
      featured: formData.featured,
      order: parseInt(formData.order) || 0,
      joinedDate: formData.joinedDate,
      imageFile,
    };

    if (isEditing) {
      await updateTeamMember(id, data);
      toast.success('Team member updated successfully!');
    } else {
      await createTeamMember(data);
      toast.success('Team member created successfully!');
    }

    navigate('/admin');
  } catch (error) {
    console.error('❌ Submit error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.errors?.join(', ') || 
                         error.message || 
                         'Something went wrong';
    toast.error(errorMessage);
  } finally {
    setLoadingSubmit(false);
  }
};

  if (loading && isEditing) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="team-form-container">
      <div className="form-header">
        <button className="back-btn" onClick={() => navigate('/admin/team/create')}>
          <FaArrowLeft /> Back to Team
        </button>
        <h1>{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            <div className="form-group image-upload">
              <label>Profile Image</label>
              <div className="image-upload-wrapper">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={removeImage}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FaUpload size={32} />
                    <p>Click to upload image</p>
                    <small>PNG, JPG up to 5MB</small>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="designation">Designation *</label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select designation</option>
                  {DESIGNATIONS.map(des => (
                    <option key={des} value={des}>{des}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-group">
              <label>Skills</label>
              <div className="skill-input-wrapper">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type skill and press Enter"
                  list="skillSuggestions"
                />
                <datalist id="skillSuggestions">
                  {SKILLS.map(skill => (
                    <option key={skill} value={skill} />
                  ))}
                </datalist>
                <button type="button" onClick={handleAddSkill} className="add-skill-btn">
                  Add
                </button>
              </div>
              <div className="skills-tags">
                {formData.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="remove-skill"
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Write a short bio about the team member..."
                maxLength="500"
              />
              <small>{formData.bio.length}/500</small>
            </div>

            <div className="form-group">
              <label htmlFor="experience">Experience</label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5 years in software development"
              />
            </div>

            <div className="social-links-group">
              <label>Social Links</label>
              <div className="form-group">
                <input
                  type="url"
                  name="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleSocialChange}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="form-group">
                <input
                  type="url"
                  name="github"
                  value={formData.socialLinks.github}
                  onChange={handleSocialChange}
                  placeholder="GitHub URL"
                />
              </div>
              <div className="form-group">
                <input
                  type="url"
                  name="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleSocialChange}
                  placeholder="Twitter URL"
                />
              </div>
              <div className="form-group">
                <input
                  type="url"
                  name="portfolio"
                  value={formData.socialLinks.portfolio}
                  onChange={handleSocialChange}
                  placeholder="Portfolio URL"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-settings">
          <h3>Additional Settings</h3>
          <div className="settings-grid">
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active Status
              </label>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured Member
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="order">Display Order</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="joinedDate">Joined Date</label>
              <input
                type="date"
                id="joinedDate"
                name="joinedDate"
                value={formData.joinedDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <span className="spinner-small"></span>
            ) : (
              <>
                <FaSave /> {isEditing ? 'Update Member' : 'Create Member'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;