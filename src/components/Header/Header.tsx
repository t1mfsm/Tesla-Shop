import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__container _container">
        
        <Link 
          to="/"
          className="header__logo"
        >
          <img src="frontend/logo.png" alt="Logo" />
        </Link>

        <div className="header__burger">
          <span></span>
        </div>

        <nav className="header__menu menu">
          <ul className="menu__list">
            <li className="menu__item">
              <Link id="MainLink" to="/details" className="menu__link menu__link_active">Детали</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
