import api from "./api";

// Get all internship programs
export const getAdminInternshipPrograms = async () => {
  const response = await api.get("/internship/programs");
  return response.data;
};

// Create internship program
export const createInternshipProgram = async (data) => {
  const response = await api.post("/internship/programs", data);
  return response.data;
};

// Update internship program
export const updateInternshipProgram = async (id, data) => {
  const response = await api.put(`/internship/programs/${id}`, data);
  return response.data;
};

// Delete internship program
export const deleteInternshipProgram = async (id) => {
  const response = await api.delete(`/internship/programs/${id}`);
  return response.data;
};


// ==========================================
// ADMIN - INTERNSHIP APPLICATIONS
// ==========================================

export const getInternshipApplications = async () => {
  const response = await api.get("/internship/applications");
  return response.data;
};

export const updateInternshipApplicationStatus = async (
  id,
  status
) => {
  const normalizedStatus =
    typeof status === "string"
      ? status.trim().toLowerCase()
      : status;

  const response = await api.put(
    `/internship/applications/${id}/status`,
    { status: normalizedStatus }
  );

  return response.data;
};