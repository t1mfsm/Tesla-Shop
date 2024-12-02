import './App.css'
import Header from './components/Header/Header'
import './styles/null.css'
import './styles/style.css'

import HomePage from './pages/HomePage/HomePage'

import { Routes, Route, useLocation } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage/DetailsPage'
import DetailPage from './pages/DetailPage/DetailPage'
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs'
import { useEffect } from 'react'
import { AccessDeniedPage } from './pages/AccessDeniedPage/AccessDeniedPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useAppDispatch, useAppSelector } from './store'
import { handleCheck } from './slices/userSlice'

function App() {


  const dispatch = useAppDispatch()

  const checked = useAppSelector((state) => state.user)
  console.log('check', checked)

  useEffect(() => {
      dispatch(handleCheck())
  }, []);

  return (
    <>
      <Header />

      {location.pathname !== '/' && <Breadcrumbs />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/403/" element={<AccessDeniedPage />} />
          <Route path="/404/" element={<NotFoundPage />} />
          <Route path='*' element={<NotFoundPage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/register/" element={<RegisterPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App