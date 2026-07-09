const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:5000/api";

const getToken = () => localStorage.getItem("admin_token");

const apiRequest = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: options.credentials ?? "omit",
    });
  } catch (_error) {
    throw new Error(
      `Unable to reach the backend at ${API_BASE}. Check that the API server is running and VITE_API_BASE_URL/CORS are correct.`,
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload?.data ?? payload;
};

export const publicApi = {
  content: () => apiRequest("/public/content"),
  track: (body) =>
    apiRequest("/public/track", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  contact: (body) =>
    apiRequest("/public/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  newsletter: (body) =>
    apiRequest("/public/newsletter", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const authApi = {
  login: (body) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () => apiRequest("/auth/me"),
  updateMe: (body) =>
    apiRequest("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  updatePassword: (body) =>
    apiRequest("/auth/me/password", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
};

export const adminApi = {
  dashboard: () => apiRequest("/admin/dashboard"),
  analytics: () => apiRequest("/admin/analytics"),
  siteSettings: () => apiRequest("/admin/site-settings"),
  updateSiteSettings: (body) =>
    apiRequest("/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  about: () => apiRequest("/admin/about"),
  updateAbout: (body) =>
    apiRequest("/admin/about", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  processes: () => apiRequest("/admin/processes"),
  processCreate: (body) =>
    apiRequest("/admin/processes", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  processUpdate: (id, body) =>
    apiRequest(`/admin/processes/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  processDelete: (id) =>
    apiRequest(`/admin/processes/${id}`, {
      method: "DELETE",
    }),
  skills: () => apiRequest("/admin/skills"),
  skillCreate: (body) =>
    apiRequest("/admin/skills", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  skillUpdate: (id, body) =>
    apiRequest(`/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  skillDelete: (id) =>
    apiRequest(`/admin/skills/${id}`, {
      method: "DELETE",
    }),
  companies: () => apiRequest("/admin/companies"),
  companyCreate: (body) =>
    apiRequest("/admin/companies", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  companyUpdate: (id, body) =>
    apiRequest(`/admin/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  companyDelete: (id) =>
    apiRequest(`/admin/companies/${id}`, {
      method: "DELETE",
    }),
  services: () => apiRequest("/admin/services"),
  serviceCreate: (body) =>
    apiRequest("/admin/services", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  serviceUpdate: (id, body) =>
    apiRequest(`/admin/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  serviceDelete: (id) =>
    apiRequest(`/admin/services/${id}`, {
      method: "DELETE",
    }),
  serviceCategories: () => apiRequest("/admin/service-categories"),
  serviceCategoryCreate: (body) =>
    apiRequest("/admin/service-categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  serviceCategoryUpdate: (id, body) =>
    apiRequest(`/admin/service-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  serviceCategoryDelete: (id) =>
    apiRequest(`/admin/service-categories/${id}`, {
      method: "DELETE",
    }),
  projects: () => apiRequest("/admin/projects"),
  projectCreate: (body) =>
    apiRequest("/admin/projects", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  projectUpdate: (id, body) =>
    apiRequest(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  projectDelete: (id) =>
    apiRequest(`/admin/projects/${id}`, {
      method: "DELETE",
    }),
  projectCategories: () => apiRequest("/admin/project-categories"),
  projectCategoryCreate: (body) =>
    apiRequest("/admin/project-categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  projectCategoryUpdate: (id, body) =>
    apiRequest(`/admin/project-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  projectCategoryDelete: (id) =>
    apiRequest(`/admin/project-categories/${id}`, {
      method: "DELETE",
    }),
  testimonials: () => apiRequest("/admin/testimonials"),
  testimonialCreate: (body) =>
    apiRequest("/admin/testimonials", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  testimonialUpdate: (id, body) =>
    apiRequest(`/admin/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  testimonialDelete: (id) =>
    apiRequest(`/admin/testimonials/${id}`, {
      method: "DELETE",
    }),
  blogs: () => apiRequest("/admin/blogs"),
  blogCreate: (body) =>
    apiRequest("/admin/blogs", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  blogUpdate: (id, body) =>
    apiRequest(`/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  blogDelete: (id) =>
    apiRequest(`/admin/blogs/${id}`, {
      method: "DELETE",
    }),
  blogCategories: () => apiRequest("/admin/blog-categories"),
  blogCategoryCreate: (body) =>
    apiRequest("/admin/blog-categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  blogCategoryUpdate: (id, body) =>
    apiRequest(`/admin/blog-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  blogCategoryDelete: (id) =>
    apiRequest(`/admin/blog-categories/${id}`, {
      method: "DELETE",
    }),
  timeline: () => apiRequest("/admin/timeline"),
  timelineCreate: (body) =>
    apiRequest("/admin/timeline", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  timelineUpdate: (id, body) =>
    apiRequest(`/admin/timeline/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  timelineDelete: (id) =>
    apiRequest(`/admin/timeline/${id}`, {
      method: "DELETE",
    }),
  contacts: () => apiRequest("/admin/contacts"),
  updateContactStatus: (id, status) =>
    apiRequest(`/admin/contacts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  replyContact: (id, body) =>
    apiRequest(`/admin/contacts/${id}/reply`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  newsletter: () => apiRequest("/admin/newsletter"),
  newsletterDelete: (id) =>
    apiRequest(`/admin/newsletter/${id}`, {
      method: "DELETE",
    }),
  adminUsers: () => apiRequest("/admin/admin-users"),
  adminUserCreate: (body) =>
    apiRequest("/admin/admin-users", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  adminUserGet: (id) => apiRequest(`/admin/admin-users/${id}`),
  adminUserUpdate: (id, body) =>
    apiRequest(`/admin/admin-users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  adminUserDelete: (id) =>
    apiRequest(`/admin/admin-users/${id}`, {
      method: "DELETE",
    }),
};

export { apiRequest };
