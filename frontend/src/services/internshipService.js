import api from "./api";

// Get all active internship programs
export const getInternshipPrograms = async () => {
  const response = await api.get("/internship/programs");
  return response.data;
};

// Get single internship program
export const getInternshipProgramById = async (id) => {
  const response = await api.get(`/internship/programs/${id}`);
  return response.data;
};

// Apply for internship
export const applyForInternship = async (programId, data) => {
  const response = await api.post(
    `/internship/programs/${programId}/apply`,
    data
  );

  return response.data;
};

// Get student's internship applications
export const getMyInternshipApplications = async () => {
  const response = await api.get("/internship/my-applications");
  return response.data;
};