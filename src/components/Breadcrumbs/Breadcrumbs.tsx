import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  // Разбиваем путь и фильтруем пустые элементы
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbsMapping: Record<string, string> = {
    '': 'Главная',
    'details': 'Детали',
    'detail': 'Описание',
    'login': 'Вход',
    'register': 'Регистрация',
    'car_order': 'Заказ',
    'car_orders': 'Заказы',
    'profile': 'Профиль',
  };

  // Проверяем, если текущий путь - главная страница "/Tesla-Shop"
  const isHomePage = location.pathname.startsWith('/Tesla-Shop');

  return (
    <nav className="breadcrumbs">
      {/* Не отображаем Breadcrumbs на главной странице "/Tesla-Shop" */}
      {!isHomePage && (
        <span>
          <Link to="/">{breadcrumbsMapping['']}</Link> {/* Главная */}
        </span>
      )}

      {/* Не отображаем хлебные крошки на главной странице */}
      {!isHomePage && pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        // Проверяем, является ли pathname числовым значением
        const isNumber = !isNaN(Number(pathname));

        if (isNumber) return null; // Пропускаем числовые значения

        return (
          <span key={routeTo}>
            {' > '}
            {pathname === 'details' ? (
              <Link to="/details">{breadcrumbsMapping['details']}</Link>
            ) : pathname === 'detail' ? (
              <>
                <Link to="/details">{breadcrumbsMapping['details']}</Link>
                {' > '}
                <Link to={`${location.pathname}`}>{breadcrumbsMapping['detail']}</Link>
              </>
            ) : pathname === 'login' ? (
              <Link to="/login">{breadcrumbsMapping['login']}</Link>
            ) : pathname === 'register' ? (
              <Link to="/register">{breadcrumbsMapping['register']}</Link>
            ) : pathname === 'car_order' ? (
              <Link to="/car_order">{breadcrumbsMapping['car_order']}</Link>
            ) : pathname === 'car_orders' ? (
              <Link to="/car_orders">{breadcrumbsMapping['car_orders']}</Link>
            ) : pathname === 'profile' ? (
              <Link to="/profile">{breadcrumbsMapping['profile']}</Link>
            ) : isLast ? (
              <span>{breadcrumbsMapping[pathname] || pathname}</span>
            ) : (
              <Link to={routeTo}>
                {breadcrumbsMapping[pathname] || pathname}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
