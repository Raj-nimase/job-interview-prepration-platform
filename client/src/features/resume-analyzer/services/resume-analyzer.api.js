import axios from "axios";

const API_BASE = "http://localhost:4000";

/**
 * Upload and analyze a resume PDF.
 * Uses FormData for multipart/form-data file upload.
 */
export async function analyzeResumeAPI(file, targetRole, userId) {
  const formData = new FormData();
  formData.append("resume", file);
  if (targetRole) formData.append("targetRole", targetRole);
  if (userId) formData.append("userId", userId);

  const res = await axios.post(`${API_BASE}/api/resume/analyze`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data;
}

/**
 * Fetch the user's resume analysis history.
 */
export async function getAnalysisHistoryAPI(userId) {
  const res = await axios.get(`${API_BASE}/api/resume/history/${userId}`, {
    withCredentials: true,
  });
  return res.data;
}
