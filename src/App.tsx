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

// const { invoke } = (window as any).__TAURI__.tauri;

// function App() {
//   useEffect(() => {
//     invoke('tauri', {cmd: 'create'})
//       .then((response: any) => console.log(response))
//       .catch((error: any) => console.log(error));
    
//     return () => {
//       invoke('tauri', { cmd: 'close' })
//         .then((response: any) => console.log(response))
//         .catch((error: any) => console.log(error));
//     }
//   }, []);


const App = () => {
  const location = useLocation();


  useEffect(() => {
    if (window.TAURI) {
      const { invoke } = window.TAURI.tauri;

      invoke('tauri', { cmd: 'create' })
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));

      return () => {
        invoke('tauri', { cmd: 'close' })
          .then((response: any) => console.log(response))
          .catch((error: any) => console.log(error));
      };
    }
  }, []);

  return (
    <>
      <Header />

      {/* Условно рендерим Breadcrumbs ниже Header, но только на страницах, кроме главной */}
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