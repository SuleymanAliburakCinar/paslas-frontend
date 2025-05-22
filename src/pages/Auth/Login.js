import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {

  const {login} = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const credentials = {"username": form.username, "password": form.password, "rememberMe": form.rememberMe};
      await login(credentials);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            name="username"
            className={styles.input}
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Parola</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="rememberMe">Beni hatırla</label>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <button type="submit" className={styles.button}>Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;