import api from '../lib/axios';

const login = (credentials) => {
  return api.post('/api/auth/login', credentials);
};

const register = (data) => {
  return api.post('/api/auth/register', data);
};

const logout = () => {
  return api.post('/api/auth/logout');
};

const authMe = () => {
  return api.get('/api/auth/authMe', {silent: true});
}

const authService = {
  login,
  register,
  logout,
  authMe,
};

export default authService;