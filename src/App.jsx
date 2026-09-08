import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'

// Components
import Navbar from './components/Navbar'
import Preloader from './sections/Preloader'
import SliceCurtain from './components/SliceCurtain'
import Footer from './sections/Footer'
import Privacidade from './pages/Privacidade'
import Termos from './pages/Termos'
import NaoEncontrado from './pages/NaoEncontrado'

// Pages
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Thoughts from './pages/Thoughts'
import Contact from './pages/Contact'

// A wrapper to initialize Lenis inside Router context if needed
function ScrollWrapper({ children }) {
  useLenis(); // Initialize smooth scroll
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Grain overlay that sits on top of everything */}
        <div className="grain-overlay" />
        
        <Preloader />
        {/* Cortina das trocas de pagina (SliceRevealer). Fica abaixo da
            barra no z-index, para o logo continuar visivel por cima. */}
        <SliceCurtain />
        <Navbar />

        <ScrollWrapper>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/about" element={<About />} />
              <Route path="/thoughts" element={<Thoughts />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacidade" element={<Privacidade />} />
              <Route path="/termos" element={<Termos />} />
              {/* /404 e alcancavel pelo link do rodape; o `*` pega
                  qualquer endereco que nao exista. */}
              <Route path="/404" element={<NaoEncontrado />} />
              <Route path="*" element={<NaoEncontrado />} />
            </Routes>
          </main>
        </ScrollWrapper>

        <Footer />
      </div>
    </Router>
  )
}
