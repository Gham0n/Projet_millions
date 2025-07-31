import React from 'react';
import Recherche from './Recherche'; 

const styles = {
  mainContent: {
    flexGrow: 1,
    padding: '40px 20px',
    maxWidth: '800px',
    margin: '30px auto',
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
};

export default function Content({ activeTab }) {
  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return (
          <>
            <h2>Bienvenue sur Projet Millions !</h2>
            <p>Votre site React stylé et simple à utiliser.</p>
          </>
        );
        case 'recherche':
        return <Recherche />;
        
      case 'contact':
        return (
          <>
            <h2>Contactez-nous</h2>
            <p>Envoyez-nous un email à contact@projetmillions.com</p>
          </>
        );
      case 'apropos':
        return (
          <>
            <h2>À propos</h2>
            <p>Projet Millions est un site web créé avec React.</p>
          </>
        );
      default:
        return null;
    }
  };

  return <main style={styles.mainContent}>{renderContent()}</main>;
}
