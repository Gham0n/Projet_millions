import React, { useState, useEffect } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import Recherche from './Recherche';
import FormulaireContact from './FormulaireContact';

const sectionStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '60px 30px',
  color: '#fff',
  textAlign: 'center',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#00a8cc',
  
};

const styles = {
  section: {
  ...sectionStyle,
  backgroundColor: '#00a8cc',
  color: '#fff',
  backgroundImage: 'url(/path/to/ton-image.jpg)', // chemin de ton image
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
},
  title: {
    color: '#fff',
    fontSize: '32px',
    marginBottom: '8px',
    fontWeight: '700',
  },
  subtitle: {
    color: '#fff',
    fontSize: '18px',
    marginBottom: '20px',
  },
  container: {
    padding: '20px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#005163ff',
    color: 'white',
    transition: 'background-color 0.3s ease',
    userSelect: 'none',
    boxShadow: '0 4px 8px rgba(0, 81, 99, 0.5)',
  },
  buttonHover: {
    backgroundColor: '#0b2d35ff',
    boxShadow: '0 6px 12px rgba(11, 45, 53, 0.7)',
  },
  formContainer: {
    marginTop: '25px',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#e0f0f5',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 15px rgba(0, 88, 115, 0.25)',
    transition: 'max-height 0.5s ease, opacity 0.5s ease',
    overflow: 'hidden',
  },
  successMessage: {
    marginTop: '15px',
    color: '#3c763d',
    backgroundColor: '#dff0d8',
    border: '1px solid #d6e9c6',
    borderRadius: '8px',
    padding: '10px 15px',
    fontWeight: '700',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    fontSize: '16px',
  },
};

const containerStyle = {
  overflow: 'hidden',
  transition: 'max-height 0.5s ease, opacity 0.5s ease',
  maxHeight: 0,
  opacity: 0,
};

const containerVisibleStyle = {
  maxHeight: '800px', // ajuste en fonction du formulaire
  opacity: 1,
  marginTop: '20px',
};

export default function Content({ activeTab, searchTerm, triggerSearch, setTriggerSearch }) {
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [hideAfterTransition, setHideAfterTransition] = useState(false);


  // Optionnel : cacher automatiquement le formulaire après envoi
  useEffect(() => {
    if (formStatus === 'sent') {
      const timer = setTimeout(() => {
        setShowForm(false);
        setFormStatus(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const formStyle = {
    transition: 'opacity 0.5s ease, visibility 0.5s ease',
    opacity: formStatus === 'sent' ? 0 : 1,
    visibility: formStatus === 'sent' ? 'hidden' : 'visible',
  };

  switch (activeTab) {
    case 'accueil':
      return (
        <ReactFullpage
          navigation
          render={() => (
            <ReactFullpage.Wrapper>
              <div className="section" style={{ ...sectionStyle, backgroundColor: '#00a8cc' }}>
                <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>
                  Comment nous rejoindre ?
                </h1>
                <p style={{ fontSize: '24px', lineHeight: '1.6', maxWidth: '1500px', textAlign: 'left' }}>
                  Vous êtes artisan et vous voulez payer votre matériel moins cher sans changer vos habitudes ?
                </p>
                <p style={{ fontSize: '24px', lineHeight: '1.6', maxWidth: '1500px', textAlign: 'left' }}>
                  Il vous suffit de remplir un court formulaire avec vos besoins habituels.
                  <br />
                  <strong>On s’occupe du reste : négociation, comparaison, économies.</strong>
                  <br />
                  Négociez vos prix grâce à la puissance du collectif.
                </p>
              </div>


              <div className="section" style={{ ...sectionStyle, backgroundColor: '#F5F7FA', color: '#333' }}>
                <h2 style={{ fontSize: '38px', fontWeight: '600', marginBottom: '15px' }}>
                  Pourquoi nous rejoindre ?
                </h2>
                <p style={{ fontSize: '22px', lineHeight: '1.5', maxWidth: '700px', textAlign: 'left' }}>
                  ✅ Aucun engagement<br />
                  ✅ Aucun changement de fournisseur<br />
                  ✅ Juste des prix plus bas pour les mêmes produits<br />
                </p>
              </div>


              <div className="section" style={styles.section}>
                <h2 style={styles.title}>📋 Remplissez le formulaire</h2>
                <p style={styles.subtitle}>Un expert vous recontacte sous 48h.</p>

                <div style={styles.container}>
                  <button
                    onClick={() => setShowForm(prev => !prev)}
                    style={styles.button}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, styles.buttonHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, styles.button)}
                  >
                    {showForm ? 'Cacher le formulaire' : 'Afficher le formulaire'}
                  </button>

                  {showForm && (
                    <div style={styles.formContainer}>
                      <FormulaireContact setFormStatus={setFormStatus} />
                    </div>
                  )}

                  {formStatus === 'sent' && (
                    <p style={styles.successMessage}>
                      Formulaire envoyé avec succès !
                    </p>
                  )}
                </div>
              </div>

            </ReactFullpage.Wrapper>
          )}
        />
      );

    case 'recherche':
      return (
        <Recherche
          searchTerm={searchTerm}
          triggerSearch={triggerSearch}
          setTriggerSearch={setTriggerSearch}
        />
      );

    case 'nos produits':
      return (
        <div style={{ ...sectionStyle, backgroundColor: '#f0f4f8', color: '#333' }}>
          <h2>Nos produits</h2>
          <p>Découvrez notre gamme de produits à prix groupés.</p>
        </div>
      );

    case 'nouveau':
      return (
        <div style={{ ...sectionStyle, backgroundColor: '#f0f4f8', color: '#333' }}>
          <h2>Nouveautés</h2>
          <p>Découvrez les derniers produits ajoutés à notre catalogue.</p>
        </div>
      );

    case 'partenaires':
      return (
        <div style={{ ...sectionStyle, backgroundColor: '#f0f4f8', color: '#333' }}>
          <h2>Nos partenaires</h2>
          <p>Rencontrez nos partenaires et découvrez leurs offres.</p>
        </div>
      );

    default:
      return <div>Contenu introuvable pour l’onglet : {activeTab}</div>;
  }
}
