const API_BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const token = this.getToken();
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 401) {
                this.removeToken();
                window.location.href = '/login';
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async signup(fullName, email, password) {
        const response = await this.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ fullName, email, password }),
        });

        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    async checkSlugAvailability(slug) {
        return await this.request(
            `/workspaces/check-slug?slug=${encodeURIComponent(slug)}`
        );
    }

    async createWorkspace(name, slug) {
        return await this.request('/workspaces', {
            method: 'POST',
            body: JSON.stringify({ name, slug }),
        });
    }

    async getWorkspaces() {
        return await this.request('/workspaces');
    }

    async getWorkspace(id) {
        return await this.request(`/workspaces/${id}`);
    }

    async updateWorkspace(id, name, slug) {
        return await this.request(`/workspaces/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, slug }),
        });
    }

    async deleteWorkspace(id) {
        return await this.request(`/workspaces/${id}`, {
            method: 'DELETE',
        });
    }

    logout() {
        this.removeToken();
        window.location.href = '/login';
    }
}

const apiClient = new ApiClient();
export default apiClient;
