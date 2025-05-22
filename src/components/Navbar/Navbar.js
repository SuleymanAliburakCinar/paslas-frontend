import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthActions from './AuthActions';

const Navbar = () => {

  const { loading } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">MyApp</Link>
      </div>
      {loading === false && (
        <AuthActions />
      )}
    </nav>
  );
};

export default Navbar;