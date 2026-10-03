import axiosClient from "./api";

// =====================================================
// STUDENT
// =====================================================

// Get available test for internship program
export const getInternshipTest = async (programId) => {
  const response = await axiosClient.get(
    `/tests/internship/${programId}`
  );

  return response.data;
};

// Start test
export const startTest = async (testId) => {
  const response = await axiosClient.post(
    `/tests/${testId}/start`
  );

  return response.data;
};

// Submit test
export const submitTest = async (attemptId, answers) => {
  const response = await axiosClient.post(
    `/test-attempts/${attemptId}/submit`,
    {
      answers,
    }
  );

  return response.data;
};

// Get single attempt
export const getMyAttempt = async (attemptId) => {
  const response = await axiosClient.get(
    `/test-attempts/my/${attemptId}`
  );

  return response.data;
};

// Get any student attempt - admin
export const getAdminAttempt = async (attemptId) => {
  const response = await axiosClient.get(
    `/test-attempts/admin/${attemptId}`
  );

  return response.data;
};

// Get all my attempts
export const getMyAttempts = async () => {
  const response = await axiosClient.get(
    `/test-attempts/my`
  );

  return response.data;
};


// =====================================================
// ADMIN
// =====================================================

// Create test
export const createTest = async (data) => {
  const response = await axiosClient.post(
    `/tests`,
    data
  );

  return response.data;
};

// Get all tests
export const getAllTests = async () => {
  const response = await axiosClient.get(
    `/tests`
  );

  return response.data;
};

// Get test by ID
export const getTestById = async (id) => {
  const response = await axiosClient.get(
    `/tests/${id}`
  );

  return response.data;
};

// Update test
export const updateTest = async (id, data) => {
  const response = await axiosClient.put(
    `/tests/${id}`,
    data
  );

  return response.data;
};

// Delete test
export const deleteTest = async (id) => {
  const response = await axiosClient.delete(
    `/tests/${id}`
  );

  return response.data;
};

// Get all student attempts - admin
export const getAllAttempts = async () => {
  const response = await axiosClient.get(
    `/test-attempts/all`
  );

  return response.data;
};