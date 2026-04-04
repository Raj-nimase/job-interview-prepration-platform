import axios from "axios";

// base URL can be configured via environment variables
const API_BASE_URL = "http://localhost:4000/api";

// create an axios instance scoped to the auth API
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies on cross‑site requests
});

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error object
 * @returns {Object} - Error object with message and status
 */
function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || data?.error || "An error occurred";

    return {
      message,
      status,
      details: data,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: "No response from server. Please check your connection.",
      status: 0,
      isNetworkError: true,
    };
  } else {
    // Error in request setup
    return {
      message: error.message || "An unexpected error occurred",
      status: null,
    };
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { valid: true };
}

/**
 * @description Register a new user.
 * @param {{name?:string,email:string,password:string}} payload
 * @returns {Promise<{user:Object,message?:string}>}
 * @throws {Object} Error object with message and status
 */
export async function register(payload) {
  try {
    // Validate input
    if (!payload?.email || !payload?.password) {
      throw new Error("Email and password are required");
    }

    if (!isValidEmail(payload.email)) {
      throw new Error("Please enter a valid email address");
    }

    const passwordValidation = validatePassword(payload.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    const response = await authClient.post("/auth/register", payload);

    if (!response.data?.user) {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    const apiError = error.response
      ? handleApiError(error)
      : new Error(error.message);
    console.error("Registration error:", apiError);
    throw apiError;
  }
}

/**
 * Log in an existing user.
 * @param {{email:string,password:string}} payload
 * @returns {Promise<{token:string,user:Object}>}
 * @throws {Object} Error object with message and status
 */
export async function login(payload) {
  try {
    // Validate input
    if (!payload?.email || !payload?.password) {
      throw new Error("Email and password are required");
    }

    if (!isValidEmail(payload.email)) {
      throw new Error("Please enter a valid email address");
    }

    const response = await authClient.post("/auth/login", payload);

    console.log(response.data.user);

    if (!response.data?.user) {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    const apiError = error.response
      ? handleApiError(error)
      : { message: error.message };
    console.error("Login error:", apiError);
    throw apiError;
  }
}

/**
 * Fetch current user using token stored in cookie.
 * The protect middleware reads the token from the cookie/header.
 * @returns {Promise<{user:Object}>}
 * @throws {Object} Error object with message and status
 */
export async function getMe() {
  try {
    const response = await authClient.get("/auth/me");

    if (!response.data?.user) {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    const apiError = error.response
      ? handleApiError(error)
      : { message: error.message };
    // avoid logging the expected 401 when no session exists
    if (apiError.status && apiError.status !== 401) {
      console.error("Get user error:", apiError);
    }
    throw apiError;
  }
}

/**
 * Log out the current user
 * @returns {Promise<{message:string}>}
 * @throws {Object} Error object with message and status
 */
export async function logout() {
  try {
    const response = await authClient.post("/auth/logout");

    if (!response.data) {
      throw new Error("Invalid response from server");
    }

    return response.data;
  } catch (error) {
    const apiError = error.response
      ? handleApiError(error)
      : { message: error.message };
    console.error("Logout error:", apiError);
    throw apiError;
  }
}

export default {
  register,
  login,
  getMe,
  logout,
};
