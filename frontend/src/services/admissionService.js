import API from "./apiClient";

export const getAllAdmissions = async (filters = {}) => {
  const response = await API.get("/admissions", {
    params: filters,
  });

  return response.data.admissions || [];
};