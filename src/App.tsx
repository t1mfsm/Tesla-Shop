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
import { invoke } from '@tauri-apps/api/core'

function App() {
  useEffect(()=>{
    invoke('tauri', {cmd:'create'})
      .then(() =>{console.log("Tauri launched")})
      .catch(() =>{console.log("Tauri not launched")})
    return () =>{
      invoke('tauri', {cmd:'close'})
        .then(() =>{console.log("Tauri launched")})
        .catch(() =>{console.log("Tauri not launched")})
    }
  }, [])

  const location= useLocation();

  return (
    <>
      <Header />

      {location.pathname !== '/' && <Breadcrumbs />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App