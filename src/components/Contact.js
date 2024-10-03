import React from 'react';
import '../style/Contact.css'; // Assurez-vous que ce fichier CSS contient le style ajouté ci-dessus

const Contact = () => {
    return (
        <>
            <div className="full-page-background"></div> {/* Image de fond */}
            <div className="contact-section">
                <h2 className="section-title">Mon Adresse</h2>
                <h3 className="section-subtitle">Où me trouver</h3>
                <div className="info-container">
                    <div className="info-block">
                        <img src="/images/phone-call.png" alt="Phone Icon" className="info-icon" />
                        <h4>Télephone</h4>
                        <p><a href="tel:08452309100">07 82 46 74 60</a> (FR)</p>
                    </div>
                    <div className="info-block">
                        <img src="/images/email.png" alt="Email Icon" className="info-icon" />
                        <h4>Adresse Email</h4>
                        <p><a href="mailto:connect@pixelimage.co.uk">thomas.barault@gmail.com</a></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
