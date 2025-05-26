import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateRegistration } from '../../utils/validation/UserValidation.ts';
import styles from './Auth.module.css';
import FormField from '../../components/FormField.jsx';

const Register = () => {

  const [form, setForm] = useState({
    "username": '',
    "password": '',
    "confirmPassword": '',
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const { register } = useAuth();

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valError = validateRegistration(form);
    const isValid = Object.values(valError).every((val) => val === null);
    if (!isValid) {
      setError((valError));
      return;
    }
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      let errorMessage = "Bilinmeyen bir hata oluştu.";
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError((prev) => ({
        ...prev,
        server: errorMessage
      }));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Kayıt Ol</h2>
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
        <FormField
          label="Parola Tekrar"
          type='password'
          value={form.confirmPassword}
          onChange={val => handleChange('confirmPassword', val)}
          error={error.confirmPassword}
        />

        {error.server && <p style={{ color: 'red', marginBottom: '1rem' }}>{error.server}</p>}

        <button type="submit" className={styles.button}>Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;
