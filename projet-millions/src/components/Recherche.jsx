import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

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
};

export default function Recherche() {
  const [csvData, setCsvData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger et parser le fichier CSV depuis /public/produits.csv
    Papa.parse('/produits.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement CSV:', err);
      },
    });
  }, []);

  const handleSearch = () => {
    setLoading(true);
    const filtered = csvData.filter((item) =>
      item.référence_fabricant.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
    setLoading(false);
  };

  return (
    <main style={styles.mainContent}>
      <h2>Page de recherche !</h2>
      <p>Utilisez notre moteur de recherche pour trouver ce que vous cherchez.</p>
      <input
        type="text"
        placeholder="Référence fabricant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        Rechercher
      </button>

      {loading && <p>Chargement...</p>}

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
