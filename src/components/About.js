import React from 'react';
import '../style/About.css';

const About = () => {
    return (
        <>
            <div className="full-page-background"></div>
            <div className="about-section">
                <h1>À propos de Thomas Barrault</h1>
                <p>
                    Passionné par le développement et les nouvelles technologies, je me spécialise dans la programmation et la résolution de problèmes complexes. 
                    Je m'intéresse particulièrement aux environnements de développement multiplateformes, et je suis toujours à la recherche de nouveaux défis pour 
                    approfondir mes compétences techniques.
                </p>
                <p>
                    J'ai acquis une solide expérience en développement avec des langages comme JavaScript, Node.js et React, et je travaille constamment pour élargir 
                    mon expertise dans des technologies modernes. À côté de mes compétences techniques, je possède un esprit analytique qui me permet d'aborder les 
                    projets avec un sens aigu du détail et de la précision.
                </p>
                <p>
                    Mon ambition est de contribuer à des projets innovants où je peux non seulement appliquer mes compétences actuelles, mais aussi apprendre et grandir en tant que développeur. 
                    Curieux et engagé, je mets un point d'honneur à livrer des solutions efficaces et adaptées aux besoins des utilisateurs.
                </p>
                <p>
                    Vous pouvez consulter mon CV en format PDF pour découvrir plus en détail mon parcours et mes compétences.
                </p>
                <div className="cv-button">
                    <a href="Thomas barrault CV.pdf" target="_blank" rel="noopener noreferrer" className="cv-download-button">
                        Télécharger mon CV
                    </a>
                </div>
            </div>
        </>
    );
};

export default About;
