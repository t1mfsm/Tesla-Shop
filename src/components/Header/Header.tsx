import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header className="header">
      <div className="header__container _container">
        
        <Link 
          to="/"
          className="header__logo"
        >
          <img src="./logo.png" alt="Logo" />
        </Link>

        <div
          className={`header__burger ${menuActive ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
        </div>

        <nav className={`header__menu menu ${menuActive ? 'active' : ''}`}>
          <ul className="menu__list">
            <li className="menu__item">
              <Link id="MainLink" to="/details" className="menu__link menu__link_active" onClick={toggleMenu}>Детали</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
