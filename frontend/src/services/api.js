/**
 * demov2v Frontend API Service
 * Interacts with the MERN Backend Server.
 */

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Get active user profile
  async getProfile() {
    const email = localStorage.getItem('userEmail') || 'elena@stanford.edu';
    const response = await fetch('/api/profile', {
      headers: {
        'X-User-Email': email
      }
    });
    return handleResponse(response);
  },

  // Update user profile details
  async updateProfile(profileData) {
    const email = localStorage.getItem('userEmail') || 'elena@stanford.edu';
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': email
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  }
};
