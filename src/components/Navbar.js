// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import '../style/Navbar.css';

const Navbar = () => {
    const { isAdmin, logout } = useContext(UserContext);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">Le Journal Du Var</Link>
            <div className="navbar-links">
                <Link to="/about" className="navbar-link">À propos</Link>
                <Link to="/contact" className="navbar-link">Contact</Link>
                {isAdmin ? (
                    <>
                        <span className="navbar-admin">Admin</span>
                        <button onClick={logout} className="navbar-button">Déconnexion</button>
                    </>
                ) : (
                    <Link to="/login" className="navbar-link">Connexion</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
