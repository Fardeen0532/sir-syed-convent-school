// Frontend API client wrapper for Sir Syed Convent School

const BASE_URL = ''; // Relative path because of Vite server proxy in dev

/**
 * Common fetch request wrapper
 */
async function request(url, options = {}) {
  // Retrieve token from local storage
  const token = localStorage.getItem('admin_token');
  
  // Set default headers
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set default credentials for cookies
  const config = {
    ...options,
    headers,
    credentials: 'omit' // We rely on Bearer token in LocalStorage for simplicity
  };

  // If request contains body and isn't FormData, stringify it
  if (config.body && !(config.body instanceof FormData) && typeof config.body === 'object') {
    headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${url}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// API Service exports
const api = {
  // --- Public Web APIs ---
  getHome: () => request('/api/home'),
  getAbout: () => request('/api/about'),
  getAcademics: () => request('/api/academics'),
  getAdmissions: () => request('/api/admissions'),
  getNotices: () => request('/api/notices'),
  getGallery: () => request('/api/gallery'),
  getContact: () => request('/api/contact'),
  
  submitAdmission: (formData) => request('/api/admission', {
    method: 'POST',
    body: formData // Must be FormData for file uploads
  }),
  
  submitEnquiry: (data) => request('/api/enquiry', {
    method: 'POST',
    body: data
  }),

  // --- Auth APIs ---
  login: async (email, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },
  
  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('admin_token');
    }
  },

  getMe: () => request('/api/auth/me'),

  // --- Admin Portal APIs ---
  getDashboard: () => request('/api/admin/dashboard'),
  
  getAdmissionsList: (search = '', status = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    return request(`/api/admin/admissions?${params.toString()}`);
  },
  
  updateAdmissionStatus: (id, status) => request(`/api/admin/admissions/${id}`, {
    method: 'PUT',
    body: { status }
  }),
  
  getEnquiriesList: () => request('/api/admin/enquiries'),
  deleteEnquiry: (id) => request(`/api/admin/enquiries/${id}`, { method: 'DELETE' }),

  createNotice: (formData) => request('/api/admin/notices', {
    method: 'POST',
    body: formData // FormData for file attachments
  }),
  
  updateNotice: (id, formData) => request(`/api/admin/notices/${id}`, {
    method: 'PUT',
    body: formData // FormData for file attachments
  }),
  
  deleteNotice: (id) => request(`/api/admin/notices/${id}`, { method: 'DELETE' }),

  uploadGallery: (formData) => request('/api/admin/gallery', {
    method: 'POST',
    body: formData // FormData for image files
  }),
  
  deleteGallery: (id) => request(`/api/admin/gallery/${id}`, { method: 'DELETE' }),

  updatePage: (slug, content, title) => request('/api/admin/pages', {
    method: 'POST',
    body: { slug, content, title }
  }),

  getSettings: () => request('/api/admin/settings'),
  
  updateSettings: (data) => request('/api/admin/settings', {
    method: 'POST',
    body: data
  }),

  getUsers: () => request('/api/admin/users'),
  createUser: (data) => request('/api/admin/users', {
    method: 'POST',
    body: data
  }),
  deleteUser: (id) => request(`/api/admin/users/${id}`, {
    method: 'DELETE'
  })
};

export default api;
