import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const AuthActions = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className={styles.authActions}>
        <a href="/login" className={styles.authLink}>Giriş Yap</a>
        <a href="/register" className={styles.authLink}>Kayıt Ol</a>
      </div>
    );
  }

  return (
    <div className={styles.authActions}>
      <span className={styles.username}>Merhaba, {user.username}</span>
      <button onClick={logout} className={styles.logoutButton}>Çıkış Yap</button>
    </div>
  );
};

export default AuthActions;