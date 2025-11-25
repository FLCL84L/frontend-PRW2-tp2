import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VeterinarioList from './components/Veterinario/VeterinarioList';
import TutorList from './components/Tutor/TutorList';
import PetList from './components/Pet/PetList';
import ConsultaList from './components/Consulta/ConsultaList';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>🐾 Clínica Pet Feliz</h1>
          <nav className="nav-menu">
            <Link to="/veterinarios" className="nav-link">Veterinários</Link>
            <Link to="/tutores" className="nav-link">Tutores</Link>
            <Link to="/pets" className="nav-link">Pets</Link>
            <Link to="/consultas" className="nav-link">Consultas</Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/veterinarios" element={<VeterinarioList />} />
            <Route path="/tutores" element={<TutorList />} />
            <Route path="/pets" element={<PetList />} />
            <Route path="/consultas" element={<ConsultaList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-container">
      <h2>Bem-vindo à Clínica Pet Feliz!</h2>
      <p>Sistema de gerenciamento veterinário</p>
      <div className="home-stats">
        <div className="stat-card">
          <h3>Veterinários</h3>
          <p>Gerencie profissionais</p>
        </div>
        <div className="stat-card">
          <h3>Tutores</h3>
          <p>Cadastre responsáveis</p>
        </div>
        <div className="stat-card">
          <h3>Pets</h3>
          <p>Administre animais</p>
        </div>
        <div className="stat-card">
          <h3>Consultas</h3>
          <p>Agende atendimentos</p>
        </div>
      </div>
    </div>
  );
}

export default App;