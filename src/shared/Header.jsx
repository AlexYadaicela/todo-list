import { NavLink } from 'react-router';
import styles from './Header.module.css';

function Header({ title }) {
  return (
    <div className={styles.navbar}>
      <h1>{title}</h1>
      <nav>
        <NavLink
          to={'/'}
          className={({ isActive }) => {
            return isActive ? styles.active : styles.inactive;
          }}
        >
          Home
        </NavLink>
        <NavLink
          to={'/about'}
          className={({ isActive }) => {
            return isActive ? styles.active : styles.inactive;
          }}
        >
          About
        </NavLink>
      </nav>
    </div>
  );
}

export default Header;
