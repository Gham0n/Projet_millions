import React, { useState } from 'react';

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
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3641dbff',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  resultItem: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  image: {
    width: '100px',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '5px',
  },
  productInfo: {
    flexGrow: 1,
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  link: {
    color: '#0052cc',
    textDecoration: 'none',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '3px solid #fff',
    borderTop: '3px solid #3641dbff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Inject spinner animation (car React inline ne gère pas les keyframes)
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default function Recherche() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    console.log('Recherche lancée pour:', searchTerm);
    setLoading(true);
    setResults(null);

    try {
      const body = searchTerm.trim() === "" ? { refFab: "" } : { refFab: searchTerm };

      const response = await fetch('http://localhost:4000/api/recherche-produit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Réponse du backend:', data);

      if (response.ok && Array.isArray(data.result)) {
        setResults(data.result);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Erreur fetch:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.mainContent}>
      <h2>Page de recherche</h2>
      <p>Utilisez notre moteur de recherche pour trouver ce que vous cherchez.</p>
      <input
        type="text"
        placeholder="Référence fabricant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button} disabled={loading}>
        {loading && <div style={styles.spinner}></div>}
        {loading ? 'Recherche en cours...' : 'Rechercher'}
      </button>

      {results && (
        <>
          {results.length === 0 ? (
            <p style={{ marginTop: '20px' }}>Aucun produit trouvé.</p>
          ) : (
            results.map((item, index) => (
              <div key={index} style={styles.resultItem}>
                <img
                  src={item.image_produit_rexel || item.image_produit_sonepar || item.image_produit_yesss}
                  alt={item.nom_produit}
                  style={styles.image}
                />
                <div style={styles.productInfo}>
                  <h3>{item.nom_produit}</h3>
                  <div style={styles.links}>
                    {item.url_produit_rexel && (
                      <a href={item.url_produit_rexel} target="_blank" rel="noreferrer" style={styles.link}>
                        Rexel
                      </a>
                    )}
                    {item.url_produit_sonepar && (
                      <a href={item.url_produit_sonepar} target="_blank" rel="noreferrer" style={styles.link}>
                        Sonepar
                      </a>
                    )}
                    {item.url_produit_yesss && (
                      <a href={item.url_produit_yesss} target="_blank" rel="noreferrer" style={styles.link}>
                        Yesss
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </main>
  );
}
