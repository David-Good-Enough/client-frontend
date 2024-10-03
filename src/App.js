import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import ArticleDetail from './components/ArticleDetail';
import Entreprise from './components/Entreprise';
import Navbar from './components/Navbar';
import Login from './components/Login'; 

function App() {
    return (
        <UserProvider>
        <Router>
            <div>
                <Navbar />  {/* Placer le composant Navbar ici */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/articles/:id" element={<ArticleDetail />} />
                    <Route path="/entreprise" element={<Entreprise />} />
                </Routes>
            </div>
        </Router>
        </UserProvider>
    );
}

export default App;
