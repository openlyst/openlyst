import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import Apps from './pages/Apps'
import AppDetail from './pages/AppDetail'
import News from './pages/News'
import Repos from './pages/Repos'
import About from './pages/About'
import ApiDocs from './pages/ApiDocs'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:id" element={<AppDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/repos" element={<Repos />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs/api" element={<ApiDocs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
