import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Entreprise = () => {
    const [entreprise, setEntreprise] = useState(null);

    useEffect(() => {
        const fetchEntreprise = async () => {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/entreprise`);
            setEntreprise(response.data[0]);
        };
        fetchEntreprise();
    }, []);

    if (!entreprise) return <div>Loading...</div>;

    return (
        <div>
            <h2>{entreprise.name}</h2>
            <p>{entreprise.description}</p>
            <p>Adresse: {entreprise.address}</p>
            <p>Téléphone: {entreprise.phone}</p>
            <p>Email: {entreprise.email}</p>
        </div>
    );
};

export default Entreprise;
