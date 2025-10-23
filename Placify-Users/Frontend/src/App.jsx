import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Preparation from './pages/Preparation.jsx'
import Experience from './pages/Experience.jsx'
import PostExperience from './pages/PostExperience.jsx'
import Contact from './pages/Contact.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/preparation" element={<Preparation />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/post-experience" element={<PostExperience />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default App