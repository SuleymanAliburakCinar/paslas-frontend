import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css';
import FormField from '../../components/FormField.jsx';

const Login = () => {

  const {login} = useAuth();
  const [form, setForm] = useState({
    "username": '',
    "password": '',
    "rememberMe": false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(form);
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
        <FormField
          label="Kullanıcı Adı"
          value={form.username}
          onChange={val => handleChange('username', val)}
          error={error.username}
        />
        <FormField
          label="Parola"
          type='password'
          value={form.password}
          onChange={val => handleChange('password', val)}
          error={error.password}
        />
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={val => handleChange('rememberMe', val.target.checked)}
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