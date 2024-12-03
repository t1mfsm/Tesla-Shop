import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAppDispatch, useAppSelector } from '../../store';
import { handleLogout } from '../../slices/userSlice';
import User from '../User';

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);


  const email = useAppSelector((state) => state.user.email);
  const navigate = useNavigate();

  const logout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(handleLogout());
    navigate('/');
    console.log('em', email)
  };

  return (
    <header className="header">
      <div className="header__container _container">
        <Link to="/" className="header__logo">
          <img src="/Tesla-Shop/logo.png" alt="Logo" />
        </Link>

        <div className="user-info-container">
          {isAuthenticated ? (
            <div className="user-info">
              <span>{email}</span>
              <Link to="/profile" className="menu__link menu__link_active">
                <User />
              </Link>
            </div>
          ) : null}

          <div
            className={`header__burger ${menuActive ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
          </div>

          <nav className={`header__menu menu ${menuActive ? 'active' : ''}`}>
            <ul className="menu__list">
              <li className="menu__item">
                <Link
                  id="MainLink"
                  to="/details"
                  className="menu__link menu__link_active"
                  onClick={toggleMenu}
                >
                  Детали
                </Link>
              </li>
              <li className="menu__item">
                <Link to="/car_orders" className="menu__link menu__link_active">
                  Заказы
                </Link>
              </li>

              {/* Дополнительные ссылки */}
              {isAuthenticated ? (
                <li className="menu__item">
                  <Link to="#" onClick={logout} className="menu__link menu__link_active">
                    Выйти
                  </Link>
                </li>
              ) : (
                <li className="menu__item">
                  <Link to="/login" className="menu__link menu__link_active">
                    Войти
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
