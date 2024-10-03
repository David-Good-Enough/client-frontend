import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import '../style/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username.trim() === '' || password.trim() === '') {
            setError('Les champs ne doivent pas être vides');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                login();

                const from = location.state?.from || '/';
                navigate(from);
            } else {
                setError('Échec de la connexion');
            }
        } catch (error) {
            setError('Erreur lors de la connexion');
            console.error('Erreur lors de la tentative de connexion:', error);
        }
    };

    return (
        <>
            <div className="full-page-background"></div>
            <div className="login-container">
                <h2>Connexion</h2>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div>
                        <label>Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </>
    );
};

export default Login;
