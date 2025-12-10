// lib/api.js - API service layer for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper to get auth token from localStorage
const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
};

// Helper to set auth token
export const setAuthToken = (token) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
};

// Helper to remove auth token
export const removeAuthToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
};

// Helper for making authenticated requests
const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
};

// ============================================
// AUTH API
// ============================================

export const authAPI = {
    register: async (email, username, name, password) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, name, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        return response.json();
    },

    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();

        // Save token to localStorage
        if (data.token) {
            setAuthToken(data.token);
        }

        return data;
    },

    logout: () => {
        removeAuthToken();
    },

    getCurrentUser: async () => {
        return fetchWithAuth('/api/auth/me');
    },

    updateProfile: async (name, username) => {
        return fetchWithAuth('/api/auth/update-profile', {
            method: 'PUT',
            body: JSON.stringify({ name, username }),
        });
    },

    changePassword: async (currentPassword, newPassword) => {
        return fetchWithAuth('/api/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },

    deleteAccount: async (password) => {
        return fetchWithAuth('/api/auth/delete-account', {
            method: 'DELETE',
            body: JSON.stringify({ password }),
        });
    },

    uploadProfilePicture: async (imageBase64) => {
        return fetchWithAuth('/api/auth/upload-profile-picture', {
            method: 'POST',
            body: JSON.stringify({ image: imageBase64 }),
        });
    },

    removeProfilePicture: async () => {
        return fetchWithAuth('/api/auth/upload-profile-picture', {
            method: 'DELETE',
        });
    },

};

// ============================================
// PORTFOLIO API
// ============================================

export const portfolioAPI = {
    // Get all user's portfolios
    getAll: async (page = 1, limit = 10) => {
        return fetchWithAuth(`/api/portfolios?page=${page}&limit=${limit}`);
    },

    // Get single portfolio by ID
    getById: async (id) => {
        return fetchWithAuth(`/api/portfolios/${id}`);
    },

    // Get portfolio by slug (public)
    getBySlug: async (slug) => {
        const response = await fetch(`${API_BASE_URL}/api/public/portfolio/${slug}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Portfolio not found');
        }
        return response.json();
    },

    // Create new portfolio
    create: async (title, description = '', theme = 'default') => {
        return fetchWithAuth('/api/portfolios', {
            method: 'POST',
            body: JSON.stringify({ title, description, theme }),
        });
    },

    // Update portfolio
    update: async (id, updates) => {
        return fetchWithAuth(`/api/portfolios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // Delete portfolio
    delete: async (id) => {
        return fetchWithAuth(`/api/portfolios/${id}`, {
            method: 'DELETE',
        });
    },

    // Publish/unpublish portfolio
    togglePublish: async (id, isPublished) => {
        return fetchWithAuth(`/api/portfolios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ isPublished }),
        });
    },
};

// ============================================
// SECTION API
// ============================================

export const sectionAPI = {
    // Get all sections for a portfolio
    getAll: async (portfolioId, includeHidden = false) => {
        return fetchWithAuth(`/api/portfolios/${portfolioId}/sections?includeHidden=${includeHidden}`);
    },

    // Create new section
    create: async (portfolioId, sectionData) => {
        return fetchWithAuth(`/api/portfolios/${portfolioId}/sections`, {
            method: 'POST',
            body: JSON.stringify(sectionData),
        });
    },

    // Update section
    update: async (sectionId, updates) => {
        return fetchWithAuth(`/api/sections/${sectionId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // Delete section
    delete: async (sectionId) => {
        return fetchWithAuth(`/api/sections/${sectionId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================
// PROJECT API
// ============================================

export const projectAPI = {
    // Get all projects for a portfolio
    getAll: async (portfolioId, featured = false) => {
        const url = featured
            ? `/api/portfolios/${portfolioId}/projects?featured=true`
            : `/api/portfolios/${portfolioId}/projects`;
        return fetchWithAuth(url);
    },

    // Get single project
    getById: async (projectId) => {
        return fetchWithAuth(`/api/projects/${projectId}`);
    },

    // Create new project
    create: async (portfolioId, projectData) => {
        return fetchWithAuth(`/api/portfolios/${portfolioId}/projects`, {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    },

    // Update project
    update: async (projectId, updates) => {
        return fetchWithAuth(`/api/projects/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // Delete project
    delete: async (projectId) => {
        return fetchWithAuth(`/api/projects/${projectId}`, {
            method: 'DELETE',
        });
    },
};

// ============================================
// UPLOAD API (placeholder - S3 setup required)
// ============================================

export const uploadAPI = {
    uploadFile: async (file) => {
        const token = getAuthToken();

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        return response.json();
    },

    // Get user's uploaded assets
    getAssets: async (page = 1, limit = 20) => {
        return fetchWithAuth(`/api/upload?page=${page}&limit=${limit}`);
    },

    // Delete asset
    deleteAsset: async (assetId) => {
        return fetchWithAuth(`/api/assets/${assetId}`, {
            method: 'DELETE',
        });
    },
};
