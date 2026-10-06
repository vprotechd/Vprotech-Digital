
// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { API_URL, applicationService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { userService, contactAdminService } from "../services/api";
import { teamService } from "../services/api";
import ConfirmDialog from "../components/common/ConfirmDialog"; 
import AdminOffers from "./admin/AdminOffers";
import {
  getAdminInternshipPrograms,
  createInternshipProgram,
  updateInternshipProgram,
  deleteInternshipProgram,
  getInternshipApplications,
  updateInternshipApplicationStatus,
} from "../services/internshipAdminService";

// Add these to your existing imports
import { 
  Briefcase as JobIcon, 
  Users as ApplicantsIcon, 
  CheckCircle as ApprovedIcon,
  XCircle as RejectedIcon,
  Clock as PendingIcon,
  Eye as ViewIcon
} from "lucide-react";

import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  LogOut,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  PlusCircle,
  Edit,
  Eye,
  LayoutDashboard,
  GraduationCap,
  Star,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  MessageSquare,
  Inbox,
  Reply,
  Archive,
  Clock,
  UserPlus,
  Search,
  Filter ,
    Tag,
  ClipboardList,
  Download,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom"
import "./AdminDashboard.css";

export default function AdminDashboard() {
const { user, logout } = useAuth();
const navigate = useNavigate();
const location = useLocation();
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [contactStats, setContactStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [contactFilter, setContactFilter] = useState("all");

  // ===== TEAM MANAGEMENT STATES =====
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const [teamFilterDepartment, setTeamFilterDepartment] = useState('all');
  const [teamFilterStatus, setTeamFilterStatus] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState({ open: false, id: null });
  const [showToggleDialog, setShowToggleDialog] = useState({ open: false, id: null });
  const [teamStats, setTeamStats] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
const [selectedInternshipApplication, setSelectedInternshipApplication] =
  useState(null);


// ===== JOB APPLICATIONS STATES =====
const [applications, setApplications] = useState([]);
const [applicationsLoading, setApplicationsLoading] = useState(false);
const [appFilterStatus, setAppFilterStatus] = useState('all');
const [appSearchTerm, setAppSearchTerm] = useState('');
const [selectedApp, setSelectedApp] = useState(null);
const [showAppDetailsModal, setShowAppDetailsModal] = useState(false);
const [downloadingResumeId, setDownloadingResumeId] = useState(null);
const [appStats, setAppStats] = useState({
  total: 0,
  pending: 0,
  reviewed: 0,
  shortlisted: 0,
  rejected: 0,
  hired: 0
});



// ===== INTERNSHIP MANAGEMENT STATES =====
const [internshipPrograms, setInternshipPrograms] = useState([]);
const [internshipLoading, setInternshipLoading] = useState(false);
const [showInternshipForm, setShowInternshipForm] = useState(false);
const [editingInternship, setEditingInternship] = useState(null);
const [internshipApplications, setInternshipApplications] = useState([]);


const [internshipApplicationsLoading, setInternshipApplicationsLoading] =
  useState(false);
const [updatingInternshipApplicationId, setUpdatingInternshipApplicationId] =
  useState(null);


const [internshipForm, setInternshipForm] = useState({
  title: "",
  domain: "",
  duration: "",
  description: "",
  eligibility: "",
  status: "draft",
});




const fetchInternshipApplications = async () => {
  try {
   setInternshipApplicationsLoading(true);

    const data = await getInternshipApplications();

    setInternshipApplications(
      data?.applications || []
    );
  } catch (error) {
    console.error(
      "❌ Failed to fetch internship applications:",
      error
    );

    toast.error(
      error?.response?.data?.message ||
        "Failed to load internship applications"
    );
  } finally {
   setInternshipApplicationsLoading(false);
  }
};


const handleInternshipApplicationStatus = async (
  applicationId,
  status
) => {
  try {
    setUpdatingInternshipApplicationId(applicationId);

    const data =
      await updateInternshipApplicationStatus(
        applicationId,
        status
      );

    if (!data?.success || !data.application?.status) {
      throw new Error(
        data?.message || "The server did not confirm the status update."
      );
    }

    const updatedStatus = data.application.status;
    toast.success("Application status updated.");

    setInternshipApplications((prev) =>
      prev.map((application) =>
        application._id === applicationId
          ? {
              ...application,
              status: updatedStatus,
            }
          : application
      )
    );

    setSelectedInternshipApplication((application) =>
      application?._id === applicationId
        ? { ...application, status: updatedStatus }
        : application
    );
  } catch (error) {
    const errorDetails = error?.response?.data;
    console.error(
      `❌ Internship status update failed for "${status}": ${
        errorDetails
          ? JSON.stringify(errorDetails)
          : error?.message || "Unknown error"
      }`
    );

    toast.error(
      errorDetails?.message ||
        "Failed to update application status."
    );
  } finally {
    setUpdatingInternshipApplicationId(null);
  }
};


// ===== INTERNSHIP MANAGEMENT =====

const fetchInternshipPrograms = async () => {
  try {
    setInternshipLoading(true);

    const data = await getAdminInternshipPrograms();

    if (data.success) {
      setInternshipPrograms(data.programs || []);
    } else {
      setInternshipPrograms([]);
    }
  } catch (error) {
    console.error("Failed to fetch internship programs:", error);
    toast.error(
      error?.response?.data?.message ||
      "Failed to load internship programs"
    );
  } finally {
    setInternshipLoading(false);
  }
};

const handleInternshipInputChange = (e) => {
  const { name, value } = e.target;

  setInternshipForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const resetInternshipForm = () => {
  setInternshipForm({
    title: "",
    domain: "",
    duration: "",
    description: "",
    eligibility: "",
    status: "draft",
  });

  setEditingInternship(null);
  setShowInternshipForm(false);
};

const handleCreateInternship = async (e) => {
  e.preventDefault();

  try {
    if (
      !internshipForm.title.trim() ||
      !internshipForm.domain.trim() ||
      !internshipForm.duration.trim() ||
      !internshipForm.description.trim()
    ) {
      toast.error(
        "Title, domain, duration and description are required"
      );
      return;
    }

    const data = await createInternshipProgram(internshipForm);

    if (data.success) {
      toast.success("Internship program created successfully");

      resetInternshipForm();
      fetchInternshipPrograms();
    }
  } catch (error) {
    console.error("Create internship error:", error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to create internship program"
    );
  }
};

const handleEditInternship = (program) => {
  setEditingInternship(program);

  setInternshipForm({
    title: program.title || "",
    domain: program.domain || "",
    duration: program.duration || "",
    description: program.description || "",
    eligibility: program.eligibility || "",
    status: program.status || "draft",
  });

  setShowInternshipForm(true);
};

const handleUpdateInternship = async (e) => {
  e.preventDefault();

  if (!editingInternship) return;

  try {
    if (
      !internshipForm.title.trim() ||
      !internshipForm.domain.trim() ||
      !internshipForm.duration.trim() ||
      !internshipForm.description.trim()
    ) {
      toast.error(
        "Title, domain, duration and description are required"
      );
      return;
    }

    const data = await updateInternshipProgram(
      editingInternship._id,
      internshipForm
    );

    if (data.success) {
      toast.success("Internship program updated successfully");

      resetInternshipForm();
      fetchInternshipPrograms();
    }
  } catch (error) {
    console.error("Update internship error:", error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to update internship program"
    );
  }
};

const handleDeleteInternship = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this internship program?"
  );

  if (!confirmed) return;

  try {
    const data = await deleteInternshipProgram(id);

    if (data.success) {
      toast.success("Internship program deleted successfully");
      fetchInternshipPrograms();
    }
  } catch (error) {
    console.error("Delete internship error:", error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to delete internship program"
    );
  }
};


// ===== BLOG MANAGEMENT STATES =====
const [blogs, setBlogs] = useState([]);
const [blogsLoading, setBlogsLoading] = useState(false);
const [blogStats, setBlogStats] = useState({
  total: 0,
  published: 0,
  views: 0
});


// ===== BLOG FUNCTIONS =====
const fetchBlogs = async () => {
  try {
    setBlogsLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, skipping blog fetch');
      setBlogs([]);
      setBlogStats({ total: 0, published: 0, views: 0 });
      setBlogsLoading(false);
      return;
    }
    
    const response = await fetch(`${API_URL}/blogs/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Blogs Response Status:', response.status);
    
    if (response.status === 401) {
      console.log('Unauthorized, skipping blog fetch');
      setBlogs([]);
      setBlogStats({ total: 0, published: 0, views: 0 });
      setBlogsLoading(false);
      return;
    }
    
    const data = await response.json();
    console.log('📊 Blogs Data:', data);
    
    // ✅ FIX: Use "blogs" instead of "data"
    if (data.success && Array.isArray(data.blogs)) {
      setBlogs(data.blogs);
      
      // Calculate stats safely
      const published = data.blogs.filter(b => b.isPublished).length || 0;
      const views = data.blogs.reduce((sum, b) => sum + (b.views || 0), 0) || 0;
      
      setBlogStats({
        total: data.blogs.length || 0,
        published: published,
        views: views
      });
    } else {
      // If no blogs or error, set empty state
      setBlogs([]);
      setBlogStats({
        total: 0,
        published: 0,
        views: 0
      });
      if (data.message) {
        console.log('Blogs message:', data.message);
      }
    }
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    toast.error('Failed to load blogs');
    setBlogs([]);
    setBlogStats({
      total: 0,
      published: 0,
      views: 0
    });
  } finally {
    setBlogsLoading(false);
  }
};




// ===== JOB APPLICATIONS FUNCTIONS =====
const fetchApplications = async () => {
  try {
    setApplicationsLoading(true);
    const token = localStorage.getItem('token');
    
  const response = await fetch(`${API_URL}/applications/all`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
    const data = await response.json();
    
    if (data.success) {
      setApplications(data.data);
      updateAppStats(data.data);
    }
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    toast.error('Failed to load applications');
  } finally {
    setApplicationsLoading(false);
  }
};
const updateAppStats = (apps) => {
  setAppStats({
    total: apps.length,
    pending: apps.filter(
      (a) => a.status === "pending"
    ).length,

    approved: apps.filter(
      (a) => a.status === "approved"
    ).length,

    rejected: apps.filter(
      (a) => a.status === "rejected"
    ).length,
  });
};


const updateApplicationStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem('token');
   const response = await fetch(`${API_URL}/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await response.json();
    if (data.success) {
      toast.success(`Application ${newStatus}`);
      fetchApplications();
      setShowAppDetailsModal(false);
    }
  } catch (error) {
    toast.error('Failed to update status');
  }
};

const handleResumeDownload = async (application) => {
  if (!application.resume) {
    toast.error("No resume is attached to this application");
    return;
  }

  setDownloadingResumeId(application._id);
  try {
    const resumeBlob = await applicationService.downloadResume(application._id);
    const downloadUrl = URL.createObjectURL(resumeBlob);
    const link = document.createElement("a");
    const extension =
      application.resumeFormat ||
      application.resume.match(/\.(pdf|docx?)($|\?)/i)?.[1] ||
      "pdf";
    const applicantName = application.name.replace(/[^a-z0-9-_]/gi, "-");

    link.href = downloadUrl;
    link.download = `${applicantName}-resume.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  } catch (error) {
    let message = error.response?.data?.message;
    if (error.response?.data instanceof Blob) {
      try {
        const errorBody = JSON.parse(await error.response.data.text());
        message = errorBody.message;
      } catch {
        message = "";
      }
    }
    toast.error(message || "Failed to download resume");
  } finally {
    setDownloadingResumeId(null);
  }
};

// Get filtered applications
const filteredApplications = applications.filter(app => {
  const matchesSearch = app.name?.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
                        app.email?.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
                        app.jobId?.title?.toLowerCase().includes(appSearchTerm.toLowerCase());
  const matchesStatus = appFilterStatus === 'all' || app.status === appFilterStatus;
  return matchesSearch && matchesStatus;
});

  useEffect(() => {
    fetchData();
    fetchTeamData();
     fetchApplications();
      fetchBlogs(); 
      
       fetchInternshipPrograms();
       fetchInternshipApplications();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, contactsRes, contactStatsRes] = await Promise.all([
        userService.getAllUsers(),
        userService.getUserStats(),
        contactAdminService.getAllMessages(),
        contactAdminService.getStats(),
      ]);
      setUsers(usersRes.users || []);
      setStats(statsRes.stats);
      setContacts(contactsRes.messages || []);
      setContactStats(contactStatsRes.stats);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };



  

  // ===== TEAM DATA FETCHING =====
  const fetchTeamData = async () => {
    setTeamLoading(true);
    try {
      const [membersRes, statsRes] = await Promise.all([
        teamService.getAdminTeamMembers(),
        teamService.getTeamStats(),
      ]);
      setTeamMembers(membersRes.members || []);
      setTeamStats(statsRes.stats);
    } catch (error) {
      console.error("Failed to fetch team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setTeamLoading(false);
    }
  };

  // ===== TEAM CRUD OPERATIONS =====
  const handleDeleteTeamMember = async () => {
    try {
      await teamService.deleteTeamMember(showDeleteDialog.id);
      toast.success("Team member deleted successfully");
      setShowDeleteDialog({ open: false, id: null });
      fetchTeamData(); // ✅ FIXED: Changed from fetchTeamMembers to fetchTeamData
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete team member");
    }
  };

  const handleToggleTeamStatus = async () => {
    try {
      await teamService.toggleTeamMemberStatus(showToggleDialog.id);
      toast.success("Team member status updated successfully");
      setShowToggleDialog({ open: false, id: null });
      fetchTeamData(); // ✅ FIXED: Changed from fetchTeamMembers to fetchTeamData
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ===== TEAM FILTERS =====
  const getFilteredTeamMembers = () => {
    let filtered = teamMembers || [];

    if (teamSearchTerm) {
      filtered = filtered.filter(member =>
        member.name?.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
        member.designation?.toLowerCase().includes(teamSearchTerm.toLowerCase())
      );
    }

    if (teamFilterDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === teamFilterDepartment);
    }

    if (teamFilterStatus !== 'all') {
      filtered = filtered.filter(member => 
        teamFilterStatus === 'active' ? member.isActive : !member.isActive
      );
    }

    return filtered;
  };

  const filteredTeamMembers = getFilteredTeamMembers();
  const totalTeamMembers = teamMembers?.length || 0;
  const activeTeamMembers = teamMembers?.filter(m => m.isActive).length || 0;
  const inactiveTeamMembers = teamMembers?.filter(m => !m.isActive).length || 0;
  const featuredTeamMembers = teamMembers?.filter(m => m.featured).length || 0;
  const departments = teamMembers ? [...new Set(teamMembers.map(m => m.department))] : [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleToggleStatus = async (userId) => {
    try {
      await userService.toggleUserStatus(userId);
      toast.success("User status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await contactAdminService.deleteMessage(contactId);
      toast.success("Message deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await contactAdminService.updateStatus(contactId, { status });
      toast.success(`Message marked as ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    try {
      await contactAdminService.updateStatus(selectedContact._id, {
        status: "replied",
        reply: replyText,
      });
      toast.success("Reply sent successfully!");
      setShowReplyModal(false);
      setReplyText("");
      setSelectedContact(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const navigateToAddBlog = () => {
    navigate("/admin/add-blog");
  };

  const navigateToManageBlogs = () => {
    navigate("/admin/add-blog");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "orange";
      case "read": return "blue";
      case "replied": return "green";
      case "archived": return "gray";
      default: return "gray";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={14} />;
      case "read": return <Eye size={14} />;
      case "replied": return <Reply size={14} />;
      case "archived": return <Archive size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (contactFilter === "all") return true;
    return contact.status === contactFilter;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Toaster position="top-right" />

      {/* ===== CONFIRM DIALOGS ===== */}
      {/* Team Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteDialog.open}
        onClose={() => setShowDeleteDialog({ open: false, id: null })}
        onConfirm={handleDeleteTeamMember}
        title="Delete Team Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
      />

      {/* Team Toggle Status Confirmation Modal */}
      <ConfirmDialog
        isOpen={showToggleDialog.open}
        onClose={() => setShowToggleDialog({ open: false, id: null })}
        onConfirm={handleToggleTeamStatus}
        title="Toggle Status"
        message={`Are you sure you want to ${
          teamMembers?.find(m => m._id === showToggleDialog.id)?.isActive ? 'deactivate' : 'activate'
        } this team member?`}
        confirmText="Confirm"
        cancelText="Cancel"
        confirmColor="yellow"
      />

      {/* Reply Modal */}
      {showReplyModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reply to {selectedContact.fullname}</h3>
              <button className="modal-close" onClick={() => setShowReplyModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="reply-message-preview">
                <p><strong>Subject:</strong> {selectedContact.subject}</p>
                <p><strong>Message:</strong></p>
                <p className="original-message">{selectedContact.message}</p>
              </div>
              <textarea
                className="reply-textarea"
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="5"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowReplyModal(false)}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleReply}>
                <Reply size={18} />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-brand">
      
          
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item ${activeTab === "team" ? "active" : ""}`}
            onClick={() => setActiveTab("team")}
          >
            <Users size={20} />
            <span>Team</span>
          </button>

          <button 
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            <MessageSquare size={20} />
            <span>Messages</span>
          </button>
          <button 
            className={`nav-item ${activeTab === "blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            <FileText size={20} />
            <span>Blogs</span>
          </button>


          <button
  className={`nav-item ${
    activeTab === "internships" ? "active" : ""
  }`}
  onClick={() => setActiveTab("internships")}
>
  <GraduationCap size={20} />
  <span>Internships</span>
</button>


<button
  onClick={() => navigate("/admin/offers")}
  className={location.pathname === "/admin/offers" ? "active" : ""}
>
  <Tag size={20} />
  <span>Offers</span>
</button>

<button
  onClick={() => navigate("/admin/tests")}
  className={`nav-item ${location.pathname === "/admin/tests" ? "active" : ""}`}
>
  <ClipboardList size={20} />
  <span>Tests</span>
</button>

          <button 
  className={`nav-item ${activeTab === "applications" ? "active" : ""}`}
  onClick={() => setActiveTab("applications")}
>
  <ApplicantsIcon size={20} />
  <span>Applications</span>
  {appStats.pending > 0 && <span className="badge">{appStats.pending}</span>}
</button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <button onClick={() => {
              fetchData();
              fetchTeamData();
            }} className="refresh-btn">
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards - Only ONE set */}
<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-icon blue">
      <Users size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-blue">{stats?.totalUsers || 0}</h3>
      <p>Total Users</p>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon green">
      <UserCheck size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-green">{stats?.totalActive || 0}</h3>
      <p>Active Users</p>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon purple">
      <Users size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-purple">{totalTeamMembers}</h3>
      <p>Team Members</p>
    </div>
  </div>
  <div className="stat-card">
    <div className="stat-icon orange">
      <MessageSquare size={24} />
    </div>
    <div className="stat-info">
      <h3 className="stat-number-orange">{contactStats?.totalMessages || 0}</h3>
      <p>Total Messages</p>
    </div>
  </div>
</div>
        {/* Quick Actions - Only ONE set */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card" onClick={() => setActiveTab("team")}>
              <Users size={28} />
              <span>Manage Team</span>
            </div>
            <div className="quick-action-card" onClick={navigateToAddBlog}>
              <PlusCircle size={28} />
              <span>Add New Blog</span>
            </div>
            <div className="quick-action-card" onClick={() => setActiveTab("users")}>
              <Users size={28} />
              <span>Manage Users</span>
            </div>
            <div className="quick-action-card" onClick={() => setActiveTab("contacts")}>
              <MessageSquare size={28} />
              <span>View Messages</span>
            </div>
          </div>
        </div>

        {/* ===== TEAM MANAGEMENT SECTION ===== */}
        {activeTab === "team" && (
          <div className="team-management-section">
            <div className="section-header">
              <h2>Team Management</h2>
              <Link to="/admin/team/create" className="add-btn">
                <UserPlus size={18} />
                Add Team Member
              </Link>
            </div>

            {/* Team Stats */}
            <div className="team-stats-grid">
              <div className="team-stat-card">
                <div className="team-stat-icon total">
                  <Users size={20} />
                </div>
                <div>
                  <h4>Total Members</h4>
                  <p>{totalTeamMembers}</p>
                </div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-icon active">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4>Active</h4>
                  <p>{activeTeamMembers}</p>
                </div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-icon inactive">
                  <UserX size={20} />
                </div>
                <div>
                  <h4>Inactive</h4>
                  <p>{inactiveTeamMembers}</p>
                </div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-icon featured">
                  <Star size={20} />
                </div>
                <div>
                  <h4>Featured</h4>
                  <p>{featuredTeamMembers}</p>
                </div>
              </div>
            </div>

            {/* Team Filters */}
            <div className="team-filters">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={teamSearchTerm}
                  onChange={(e) => setTeamSearchTerm(e.target.value)}
                  className="search-input"
                />
                {teamSearchTerm && (
                  <button onClick={() => setTeamSearchTerm('')} className="clear-search">
                    <XCircle size={16} />
                  </button>
                )}
              </div>

              <div className="filter-group">
                <Filter size={18} className="filter-icon" />
                <select
                  value={teamFilterDepartment}
                  onChange={(e) => setTeamFilterDepartment(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  value={teamFilterStatus}
                  onChange={(e) => setTeamFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Team Members Table */}
            <div className="team-table-wrapper">
              {teamLoading ? (
                <div className="team-loading">
                  <div className="spinner-small"></div>
                  <p>Loading team members...</p>
                </div>
              ) : filteredTeamMembers.length === 0 ? (
                <div className="empty-state">
                  <Users size={64} />
                  <h3>No team members found</h3>
                  <p>Get started by adding your first team member</p>
                  <Link to="/admin/team/create" className="add-btn">
                    <UserPlus size={18} />
                    Add Team Member
                  </Link>
                </div>
              ) : (
                <table className="team-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeamMembers.map((member) => (
                      <tr key={member._id}>
                        <td className="member-cell">
                          <img
                            src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4F46E5&color=fff&size=40`}
                            alt={member.name}
                            className="member-avatar"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4F46E5&color=fff&size=40`;
                            }}
                          />
                          <div>
                            <div className="member-name">{member.name}</div>
                            <div className="member-email">{member.email}</div>
                          </div>
                        </td>
                        <td>{member.designation}</td>
                        <td>
                          <span className="department-tag">{member.department}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {member.featured && <Star size={16} className="featured-star" />}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              to={`/admin/team/edit/${member._id}`}
                              className="action-btn edit"
                              title="Edit Member"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => setShowToggleDialog({ open: true, id: member._id })}
                              className={`action-btn toggle ${member.isActive ? 'active' : 'inactive'}`}
                              title={member.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {member.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </button>
                            <button
                              onClick={() => setShowDeleteDialog({ open: true, id: member._id })}
                              className="action-btn delete"
                              title="Delete Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ===== USERS TAB ===== */}
        {activeTab === "users" && (
          <div className="users-table-container">
            <h2>All Users</h2>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Domain</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-users">No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.phone || "N/A"}</td>
                        <td>{u.domain || "N/A"}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.isActive ? "active" : "inactive"}`}>
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleToggleStatus(u._id)}
                              className={`action-btn ${u.isActive ? "deactivate" : "activate"}`}
                              title={u.isActive ? "Deactivate" : "Activate"}
                            >
                              {u.isActive ? (
                                <XCircle size={16} />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="action-btn delete"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


{activeTab === "internships" && (
  <div className="admin-section internship-admin-section">

    {/* =====================================================
        ADD / EDIT INTERNSHIP MODAL
    ====================================================== */}

    {showInternshipForm && (
      <div className="internship-modal-overlay">
        <div className="internship-modal">

          <div className="internship-modal-header">
            <div>
              <h2>
                {editingInternship
                  ? "Edit Internship Program"
                  : "Add Internship Program"}
              </h2>

              <p>
                Enter the internship program details below.
              </p>
            </div>

            <button
              type="button"
              className="internship-modal-close"
              onClick={resetInternshipForm}
            >
              <XCircle size={24} />
            </button>
          </div>

          <form
            onSubmit={
              editingInternship
                ? handleUpdateInternship
                : handleCreateInternship
            }
            className="internship-form"
          >

            {/* TITLE + DOMAIN */}
            <div className="form-row">

              <div className="form-group">
                <label>Program Title *</label>

                <input
                  type="text"
                  name="title"
                  value={internshipForm.title}
                  onChange={handleInternshipInputChange}
                  placeholder="e.g. Full Stack Web Development"
                  required
                />
              </div>

              <div className="form-group">
                <label>Domain *</label>

                <input
                  type="text"
                  name="domain"
                  value={internshipForm.domain}
                  onChange={handleInternshipInputChange}
                  placeholder="e.g. Web Development"
                  required
                />
              </div>

            </div>

            {/* DURATION + STATUS */}
            <div className="form-row">

              <div className="form-group">
                <label>Duration *</label>

                <input
                  type="text"
                  name="duration"
                  value={internshipForm.duration}
                  onChange={handleInternshipInputChange}
                  placeholder="e.g. 6 Months"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status *</label>

                <select
                  name="status"
                  value={internshipForm.status}
                  onChange={handleInternshipInputChange}
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Description *</label>

              <textarea
                name="description"
                value={internshipForm.description}
                onChange={handleInternshipInputChange}
                placeholder="Describe the internship program..."
                rows="5"
                required
              />
            </div>

            {/* ELIGIBILITY */}
            <div className="form-group">
              <label>Eligibility</label>

              <textarea
                name="eligibility"
                value={internshipForm.eligibility}
                onChange={handleInternshipInputChange}
                placeholder="e.g. B.Tech, BCA, MCA, B.Com or relevant students"
                rows="3"
              />
            </div>

            {/* ACTIONS */}
            <div className="internship-form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={resetInternshipForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                {editingInternship ? (
                  <>
                    <Edit size={18} />
                    Update Program
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    Create Program
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      </div>
    )}

    {/* =====================================================
        INTERNSHIP PROGRAM HEADER
    ====================================================== */}

    <div className="section-header">

      <div>
        <h2>
          Internship Programs
        </h2>

        <p>
          Create and manage internship programs displayed
          on the website.
        </p>
      </div>

      <button
        type="button"
        className="primary-btn"
        onClick={() => {
          setEditingInternship(null);

          setInternshipForm({
            title: "",
            domain: "",
            duration: "",
            description: "",
            eligibility: "",
            status: "draft",
          });

          setShowInternshipForm(true);
        }}
      >
        <PlusCircle size={18} />
        Add Internship
      </button>

    </div>

    {/* =====================================================
        SELECTED INTERNSHIP DETAILS
        NO POPUP
    ====================================================== */}

    {selectedInternship && (
      <div className="admin-internship-details-section">

        <div className="admin-section-header">

          <div>
            <span className="admin-section-label">
              PROGRAM DETAILS
            </span>

            <h2>
              {selectedInternship.title}
            </h2>

            <p>
              Complete information about this internship
              program.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={() =>
              setSelectedInternship(null)
            }
          >
            Close Details
          </button>

        </div>

        <div className="admin-internship-details-table-wrapper">

          <table className="admin-internship-details-table">

            <tbody>

              <tr>
                <th>Program Title</th>
                <td>
                  {selectedInternship.title || "N/A"}
                </td>
              </tr>

              <tr>
                <th>Domain</th>
                <td>
                  {selectedInternship.domain || "N/A"}
                </td>
              </tr>

              <tr>
                <th>Duration</th>
                <td>
                  {selectedInternship.duration || "N/A"}
                </td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span
                    className={`internship-status ${
                      selectedInternship.status
                    }`}
                  >
                    {selectedInternship.status}
                  </span>
                </td>
              </tr>

              <tr>
                <th>Description</th>
                <td>
                  {selectedInternship.description || "N/A"}
                </td>
              </tr>

              <tr>
                <th>Eligibility</th>
                <td>
                  {selectedInternship.eligibility || "N/A"}
                </td>
              </tr>

              <tr>
                <th>Created On</th>
                <td>
                  {selectedInternship.createdAt
                    ? new Date(
                        selectedInternship.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </td>
              </tr>

              <tr>
                <th>Last Updated</th>
                <td>
                  {selectedInternship.updatedAt
                    ? new Date(
                        selectedInternship.updatedAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>
    )}

    {/* =====================================================
        INTERNSHIP PROGRAM LIST
    ====================================================== */}

    {internshipLoading ? (

      <div className="internship-admin-loading">

        <RefreshCw
          size={24}
          className="spin"
        />

        <p>
          Loading internship programs...
        </p>

      </div>

    ) : internshipPrograms.length === 0 ? (

      <div className="internship-admin-empty">

        <GraduationCap size={45} />

        <h3>
          No Internship Programs
        </h3>

        <p>
          No internship programs have been created yet.
        </p>

        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            setEditingInternship(null);

            setInternshipForm({
              title: "",
              domain: "",
              duration: "",
              description: "",
              eligibility: "",
              status: "draft",
            });

            setShowInternshipForm(true);
          }}
        >
          <PlusCircle size={18} />
          Create First Program
        </button>

      </div>

    ) : (

      <div className="internship-admin-grid">

        {internshipPrograms.map((program) => (

          <div
            className="internship-admin-card"
            key={program._id}
          >

            {/* CARD TOP */}
            <div className="internship-admin-card-top">

              <div className="internship-admin-icon">
                <GraduationCap size={25} />
              </div>

              <span
                className={`internship-status ${
                  program.status
                }`}
              >
                {program.status}
              </span>

            </div>

            {/* TITLE */}
            <h3>
              {program.title}
            </h3>

            {/* DOMAIN */}
            <p className="internship-domain">
              <strong>Domain:</strong>{" "}
              {program.domain}
            </p>

            {/* DURATION */}
            <p className="internship-duration">
              <strong>Duration:</strong>{" "}
              {program.duration}
            </p>

            {/* DESCRIPTION */}
            <p className="internship-description">
              {program.description}
            </p>

            {/* ELIGIBILITY */}
            {program.eligibility && (
              <p className="internship-eligibility">
                <strong>Eligibility:</strong>{" "}
                {program.eligibility}
              </p>
            )}

            {/* ACTIONS */}
            <div className="internship-card-actions">

              {/* DETAILS */}
              <button
                type="button"
                className="details-btn"
                onClick={() => {
                  setSelectedInternship(program);

                  setTimeout(() => {
                    document
                      .querySelector(
                        ".admin-internship-details-section"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }, 50);
                }}
              >
                <Eye size={16} />
                Details
              </button>

              {/* EDIT */}
              <button
                type="button"
                className="edit-btn"
                onClick={() =>
                  handleEditInternship(program)
                }
              >
                <Edit size={16} />
                Edit
              </button>

              {/* DELETE */}
              <button
                type="button"
                className="delete-btn"
                onClick={() =>
                  handleDeleteInternship(program._id)
                }
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    )}

    {/* =====================================================
        INTERNSHIP APPLICATIONS
    ====================================================== */}

    <div className="admin-internship-applications">

      <div className="admin-section-header">

        <div>

          <span className="admin-section-label">
            APPLICATIONS
          </span>

          <h2>
            Internship Applications
          </h2>

          <p>
            Review applicants and manage application status.
          </p>

        </div>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={fetchInternshipApplications}
          disabled={applicationsLoading}
        >
          {applicationsLoading
            ? "Loading..."
            : "Refresh Applications"}
        </button>

      </div>

      {/* APPLICATION LOADING */}
      {applicationsLoading ? (

        <div className="admin-internship-empty">

          <div className="admin-internship-spinner"></div>

          <p>
            Loading applications...
          </p>

        </div>

      ) : internshipApplications.length === 0 ? (

        /* NO APPLICATIONS */
        <div className="admin-internship-empty">

          <h3>
            No Applications Yet
          </h3>

          <p>
            Internship applications submitted by students
            will appear here.
          </p>

        </div>

      ) : (

        <div className="admin-internship-table-wrapper">

          <table className="admin-internship-table">

            <thead>

              <tr>
                <th>Applicant</th>
                <th>Internship</th>
                <th>Contact</th>
                <th>Education</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Details</th>
              </tr>

            </thead>

            <tbody>

              {internshipApplications.map(
                (application) => {

                  const applicantName =
                    application.name ||
                    application.applicant?.name ||
                    "N/A";

                  const applicantEmail =
                    application.email ||
                    application.applicant?.email ||
                    "N/A";

                  return (

                    <tr
                      key={application._id}
                    >

                      {/* APPLICANT */}
                      <td>

                        <div className="admin-applicant-info">

                          <strong>
                            {applicantName}
                          </strong>

                          <span>
                            {applicantEmail}
                          </span>

                        </div>

                      </td>

                      {/* INTERNSHIP */}
                      <td>

                        <div className="admin-internship-info">

                          <strong>
                            {application.program?.title ||
                              "N/A"}
                          </strong>

                          <span>
                            {application.program?.domain ||
                              ""}
                          </span>

                        </div>

                      </td>

                      {/* PHONE */}
                      <td>
                        {application.phone || "N/A"}
                      </td>

                      {/* EDUCATION */}
                      <td>
                        {application.education || "N/A"}
                      </td>

                      {/* APPLIED DATE */}
                      <td>

                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}

                      </td>

                      {/* STATUS */}
                      <td>
<select
  value={application.status || "pending"}
  disabled={updatingInternshipApplicationId === application._id}
  onChange={(e) =>
    handleInternshipApplicationStatus(
      application._id,
      e.target.value
    )
  }
  className={`admin-application-status status-${
    application.status || "pending"
  }`}
>
  <option value="pending">
    Pending
  </option>

  <option value="approved">
    Approved / Test Unlocked
  </option>

  <option value="rejected">
    Rejected
  </option>


</select>
                      </td>

                      {/* APPLICATION DETAILS */}
                      <td>

                        <button
                          type="button"
                          className="details-btn"
                          onClick={() => {

                            setSelectedInternshipApplication(
                              application
                            );

                            setTimeout(() => {
                              document
                                .querySelector(
                                  ".admin-internship-application-details"
                                )
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            }, 50);

                          }}
                        >
                          <Eye size={15} />
                          Details
                        </button>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

    {/* =====================================================
        SELECTED APPLICATION DETAILS
        NO POPUP
    ====================================================== */}

    {selectedInternshipApplication && (

      <div className="admin-internship-application-details">

        <div className="admin-section-header">

          <div>

            <span className="admin-section-label">
              APPLICATION DETAILS
            </span>

            <h2>
              {selectedInternshipApplication.name ||
                "Applicant Details"}
            </h2>

            <p>
              Complete application information and current status.
            </p>

          </div>

          <button
            type="button"
            className="admin-refresh-btn"
            onClick={() =>
              setSelectedInternshipApplication(null)
            }
          >
            Close Details
          </button>

        </div>

        <div className="admin-internship-details-table-wrapper">

          <table className="admin-internship-details-table">

            <tbody>

              {/* NAME */}
              <tr>
                <th>Applicant Name</th>

                <td>
                  {selectedInternshipApplication.name ||
                    selectedInternshipApplication.applicant?.name ||
                    "N/A"}
                </td>
              </tr>

              {/* EMAIL */}
              <tr>
                <th>Email</th>

                <td>
                  {selectedInternshipApplication.email ||
                    selectedInternshipApplication.applicant?.email ||
                    "N/A"}
                </td>
              </tr>

              {/* PHONE */}
              <tr>
                <th>Phone</th>

                <td>
                  {selectedInternshipApplication.phone ||
                    "N/A"}
                </td>
              </tr>

              {/* EDUCATION */}
              <tr>
                <th>Education</th>

                <td>
                  {selectedInternshipApplication.education ||
                    "N/A"}
                </td>
              </tr>

              {/* PROGRAM */}
              <tr>
                <th>Internship Program</th>

                <td>
                  {selectedInternshipApplication.program
                    ?.title || "N/A"}
                </td>
              </tr>

              {/* DOMAIN */}
              <tr>
                <th>Domain</th>

                <td>
                  {selectedInternshipApplication.program
                    ?.domain || "N/A"}
                </td>
              </tr>

              {/* DURATION */}
              <tr>
                <th>Program Duration</th>

                <td>
                  {selectedInternshipApplication.program
                    ?.duration || "N/A"}
                </td>
              </tr>

              {/* APPLIED DATE */}
              <tr>
                <th>Applied On</th>

                <td>
                  {selectedInternshipApplication.createdAt
                    ? new Date(
                        selectedInternshipApplication.createdAt
                      ).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "N/A"}
                </td>
              </tr>

              {/* STATUS */}
              <tr>
                <th>Application Status</th>

                <td>

                  <span
                    className={`internship-status ${
                      selectedInternshipApplication.status
                    }`}
                  >
                    {selectedInternshipApplication.status ===
                    "approved"
                      ? "Approved / Test Unlocked"
                      : selectedInternshipApplication.status ||
                        "Pending"}
                  </span>

                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    )}

  </div>
)}

        {/* ===== CONTACTS TAB ===== */}
        {activeTab === "contacts" && (
          <div className="contacts-section">
            <div className="section-header">
              <h2>Contact Messages</h2>
              <div className="contact-filters">
                <button
                  className={`filter-btn ${contactFilter === "all" ? "active" : ""}`}
                  onClick={() => setContactFilter("all")}
                >
                  All ({contactStats?.totalMessages || 0})
                </button>
                <button
                  className={`filter-btn ${contactFilter === "pending" ? "active" : ""}`}
                  onClick={() => setContactFilter("pending")}
                >
                  Pending ({contactStats?.pending || 0})
                </button>
                <button
                  className={`filter-btn ${contactFilter === "read" ? "active" : ""}`}
                  onClick={() => setContactFilter("read")}
                >
                  Read ({contactStats?.read || 0})
                </button>
                <button
                  className={`filter-btn ${contactFilter === "replied" ? "active" : ""}`}
                  onClick={() => setContactFilter("replied")}
                >
                  Replied ({contactStats?.replied || 0})
                </button>
              </div>
            </div>

            <div className="contacts-list">
              {filteredContacts.length === 0 ? (
                <div className="no-contacts">
                  <Inbox size={48} />
                  <h3>No messages</h3>
                  <p>No contact messages found</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div key={contact._id} className="contact-card">
                    <div className="contact-header">
                      <div className="contact-info">
                        <h4>{contact.fullname}</h4>
                        <div className="contact-meta">
                          <span><Mail size={14} /> {contact.email}</span>
                          <span><Phone size={14} /> {contact.phone}</span>
                          <span><Calendar size={14} /> {new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="contact-status">
                        <span className={`status-badge ${getStatusColor(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="contact-body">
                      <p><strong>Subject:</strong> {contact.subject}</p>
                      <p className="contact-message">{contact.message}</p>
                      {contact.reply && (
                        <div className="contact-reply">
                          <p><strong>Reply:</strong> {contact.reply}</p>
                        </div>
                      )}
                    </div>
                    <div className="contact-actions">
                      {contact.status === "pending" && (
                        <button
                          className="action-btn mark-read"
                          onClick={() => handleUpdateContactStatus(contact._id, "read")}
                        >
                          <Eye size={16} />
                          Mark as Read
                        </button>
                      )}
                      {contact.status !== "replied" && contact.status !== "archived" && (
                        <button
                          className="action-btn reply"
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowReplyModal(true);
                          }}
                        >
                          <Reply size={16} />
                          Reply
                        </button>
                      )}
                      {contact.status === "read" && (
                        <button
                          className="action-btn archive"
                          onClick={() => handleUpdateContactStatus(contact._id, "archived")}
                        >
                          <Archive size={16} />
                          Archive
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteContact(contact._id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

       {/* ===== BLOGS TAB ===== */}
{activeTab === "blogs" && (
  <div className="blogs-section">
    <div className="section-header">
      <h2>Blog Management</h2>
      <button className="add-blog-btn" onClick={navigateToAddBlog}>
        <PlusCircle size={18} />
        Add New Blog
      </button>
    </div>

    {/* Blog Stats */}
    <div className="blog-stats-grid">
      <div className="blog-stat-card">
        <div className="blog-stat-icon">
          <FileText size={24} />
        </div>
        <div>
          <h4>Total Blogs</h4>
          <p>{blogStats.total}</p>
        </div>
      </div>
      <div className="blog-stat-card">
        <div className="blog-stat-icon green">
          <CheckCircle size={24} />
        </div>
        <div>
          <h4>Published</h4>
          <p>{blogStats.published}</p>
        </div>
      </div>
      <div className="blog-stat-card">
        <div className="blog-stat-icon yellow">
          <Eye size={24} />
        </div>
        <div>
          <h4>Total Views</h4>
          <p>{blogStats.views}</p>
        </div>
      </div>
    </div>

    {/* Blogs List */}
    {blogsLoading ? (
      <div className="blog-loading">Loading blogs...</div>
    ) : blogs.length === 0 ? (
      <div className="blog-placeholder">
        <FileText size={48} />
        <h3>No blogs yet</h3>
        <p>Create your first blog post</p>
        <button className="add-blog-btn" onClick={navigateToAddBlog}>
          <PlusCircle size={18} />
          Add New Blog
        </button>
      </div>
    ) : (
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <div className="blog-card-content">
              {/* ✅ Blog Image */}
              {blog.image ? (
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="blog-thumbnail"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="blog-thumbnail-placeholder">
                  <FileText size={24} />
                </div>
              )}
              
              <div className="blog-info">
                <h4 className="blog-title">{blog.title}</h4>
                <div className="blog-meta">
                  <span>
                    <Calendar size={14} /> 
                    {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span>
                    <Eye size={14} /> {blog.views || 0} views
                  </span>
                  <span className={`blog-status ${blog.isPublished ? 'published' : 'draft'}`}>
                    {blog.isPublished ? '✅ Published' : '📝 Draft'}
                  </span>
                </div>
              </div>
              <div className="blog-actions">
                <Link to={`/admin/edit-blog/${blog._id}`} className="action-btn edit" title="Edit">
                  <Edit size={16} />
                </Link>
                <button 
                  className="action-btn delete" 
                  title="Delete"
                  onClick={() => {
                    if (window.confirm(`Delete "${blog.title}"?`)) {
                      // Add delete function here
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

        {/* ===== APPLICATIONS TAB ===== */}
{activeTab === "applications" && (
  <div className="applications-section">
    <div className="section-header">
      <h2>Job Applications</h2>
      <div className="app-stats-summary">
        <span>Total: {appStats.total}</span>
        <span className="pending-count">Pending: {appStats.pending}</span>
        <span className="shortlisted-count">Shortlisted: {appStats.shortlisted}</span>
      </div>
    </div>

    {/* Application Stats */}
    <div className="app-stats-grid">
      <div className="app-stat-card total">
        <ApplicantsIcon size={24} />
        <div>
          <h4>Total</h4>
          <p>{appStats.total}</p>
        </div>
      </div>
      <div className="app-stat-card pending">
        <PendingIcon size={24} />
        <div>
          <h4>Pending</h4>
          <p>{appStats.pending}</p>
        </div>
      </div>
      <div className="app-stat-card shortlisted">
        <ApprovedIcon size={24} />
        <div>
          <h4>Shortlisted</h4>
          <p>{appStats.shortlisted}</p>
        </div>
      </div>
      <div className="app-stat-card hired">
        <Award size={24} />
        <div>
          <h4>Hired</h4>
          <p>{appStats.hired}</p>
        </div>
      </div>
    </div>

    {/* Search & Filter */}
    <div className="app-filters">
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, email, or job..."
          value={appSearchTerm}
          onChange={(e) => setAppSearchTerm(e.target.value)}
          className="search-input"
        />
        {appSearchTerm && (
          <button onClick={() => setAppSearchTerm('')} className="clear-search">
            <XCircle size={16} />
          </button>
        )}
      </div>
      <select
        value={appFilterStatus}
        onChange={(e) => setAppFilterStatus(e.target.value)}
        className="filter-select"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="rejected">Rejected</option>
        <option value="hired">Hired</option>
      </select>
    </div>

    {/* Applications List */}
    <div className="app-list">
      {applicationsLoading ? (
        <div className="app-loading">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="empty-state">
          <ApplicantsIcon size={48} />
          <h3>No applications found</h3>
          <p>No job applications have been submitted yet</p>
        </div>
      ) : (
        filteredApplications.map((app) => (
          <div key={app._id} className="app-card">
            <div className="app-card-header">
              <div className="app-info">
                <div className="app-avatar">
                  {app.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{app.name}</h4>
                  <div className="app-meta">
                    <span><Mail size={14} /> {app.email}</span>
                    <span><Phone size={14} /> {app.phone}</span>
                    <span><Briefcase size={14} /> {app.jobId?.title || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="app-actions">
                <span className={`status-badge ${app.status}`}>
                  {app.status}
                </span>
                <button 
                  className="action-btn view"
                  onClick={() => {
                    setSelectedApp(app);
                    setShowAppDetailsModal(true);
                  }}
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
            <div className="app-card-footer">
              <span><Calendar size={14} /> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
              <span><Clock size={14} /> Available: {app.availableTime}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}


{/* Application Details Modal */}
{showAppDetailsModal && selectedApp && (
  <div className="modal-overlay application-details-overlay" onClick={() => setShowAppDetailsModal(false)}>
    <div className="modal-content app-details-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Application Details</h2>
        <button className="modal-close" onClick={() => setShowAppDetailsModal(false)}>
          <XCircle size={24} />
        </button>
      </div>

      <div className="app-details">
        <div className="app-detail-section">
          <h3>Applicant Information</h3>
          <div className="app-detail-grid">
            <div><label>Name:</label> <p>{selectedApp.name}</p></div>
            <div><label>Email:</label> <p>{selectedApp.email}</p></div>
            <div><label>Phone:</label> <p>{selectedApp.phone}</p></div>
            <div><label>Available Time:</label> <p>{selectedApp.availableTime}</p></div>
            <div><label>Experience:</label> <p>{selectedApp.experience || 'Not specified'}</p></div>
            <div><label>Status:</label> <p className={`status-badge ${selectedApp.status}`}>{selectedApp.status}</p></div>
          </div>
        </div>

        {selectedApp.coverLetter && (
          <div className="app-detail-section">
            <h3>Cover Letter</h3>
            <p className="cover-letter-text">{selectedApp.coverLetter}</p>
          </div>
        )}

        <div className="app-detail-section">
          <h3>Resume</h3>
          {selectedApp.resume ? (
            <button
              type="button"
              className="admin-resume-btn"
              onClick={() => handleResumeDownload(selectedApp)}
              disabled={downloadingResumeId === selectedApp._id}
            >
              <Download size={16} />
              {downloadingResumeId === selectedApp._id
                ? "Downloading..."
                : "Download Resume"}
            </button>
          ) : (
            <p className="cover-letter-text">No resume was attached to this application.</p>
          )}
        </div>

        <div className="app-detail-section">
          <h3>Update Status</h3>
          <div className="status-update-buttons">
            {['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map((status) => (
              <button
                key={status}
                className={`status-btn ${status === selectedApp.status ? 'active' : ''}`}
                onClick={() => updateApplicationStatus(selectedApp._id, status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modal-actions">
        <button className="cancel-btn" onClick={() => setShowAppDetailsModal(false)}>
          Close
        </button>
      </div>
    </div>
  </div>
)}

        {/* ===== DASHBOARD OVERVIEW ===== */}
        {activeTab === "dashboard" && (
          <div className="dashboard-overview">
            <div className="welcome-section">
              <h2>Welcome back, {user?.name}!</h2>
              <p>Here's what's happening with your platform today.</p>
            </div>
            
            <div className="domain-stats">
              <h3>Users by Domain</h3>
              <div className="domain-grid">
                {stats?.domainStats?.map((item, index) => (
                  <div key={index} className="domain-item">
                    <span className="domain-name">{item._id || "Other"}</span>
                    <span className="domain-count">{item.count}</span>
                  </div>
                ))}
                {(!stats?.domainStats || stats.domainStats.length === 0) && (
                  <p className="no-data">No domain data available</p>
                )}
              </div>
            </div>

            <div className="recent-users">
              <h3>Recent Users</h3>
              <div className="recent-users-list">
                {users.slice(0, 5).map((u) => (
                  <div key={u._id} className="recent-user-item">
                    <div className="recent-user-avatar">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="recent-user-info">
                      <h4>{u.name}</h4>
                      <p>{u.email}</p>
                    </div>
                    <span className={`status-badge small ${u.isActive ? "active" : "inactive"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="no-data">No users registered yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}