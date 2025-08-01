import React, { useEffect, useState } from 'react';

const styles = {
  mainContent: {
    flexGrow: 1,
    padding: '40px 20px',
    maxWidth: '900px',
    margin: '30px auto',
    color: '#333',
    backgroundColor: '#f0f4f8',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    backgroundColor: '#fefefe',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    padding: '15px',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'contain',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  productName: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  links: {
    display: 'flex',
    gap: '10px',
  },
  linkBtn: {
    flexGrow: 1,
    textAlign: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: '#00a8cc',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    display: 'inline-block', // important pour transform
  },
  linkBtnHover: {
    backgroundColor: '#005163ff',
    transform: 'scale(1.05)',
  },
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #eee',
    borderTop: '4px solid #3641db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '16px',
  }
};

const Recherche = ({ searchTerm, triggerSearch, setTriggerSearch }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pour gérer le hover sur chaque bouton (clé = url ou index)
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    if (!triggerSearch) return;

    const fetchResults = async () => {
      setLoading(true);
      setResults(null);
      setTriggerSearch(false);

      try {
        const body = searchTerm.trim() === "" ? { refFab: "" } : { refFab: searchTerm };
        const response = await fetch('http://localhost:4000/api/recherche-produit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();

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

    fetchResults();
  }, [triggerSearch, searchTerm, setTriggerSearch]);

  // Style dynamique pour gérer le cas d’un seul résultat
  const resultsGridStyle = {
    ...styles.resultsGrid,
    gridTemplateColumns: results && results.length === 1 ? '1fr' : styles.resultsGrid.gridTemplateColumns,
    maxWidth: results && results.length === 1 ? '350px' : '100%',
    margin: results && results.length === 1 ? '20px auto' : '20px 0',
  };

  const imageStyle = {
    ...styles.image,
    height: results && results.length === 1 ? '250px' : styles.image.height,
  };

  // Fonction pour générer un bouton avec hover géré
  const renderLinkBtn = (url, label) => {
    const isHovered = hoveredLink === url;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{
          ...styles.linkBtn,
          ...(isHovered ? styles.linkBtnHover : {}),
        }}
        onMouseEnter={() => setHoveredLink(url)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        {label}
      </a>
    );
  };

  return (
    <main style={styles.mainContent}>
      <h2>Résultats de recherche</h2>
      {!searchTerm && <p style={styles.message}>Saisissez une référence fabricant pour lancer la recherche.</p>}

      {loading && (
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
        </div>
      )}

      {results && results.length === 0 && (
        <p style={styles.message}>Aucun produit trouvé.</p>
      )}

      {results && results.length > 0 && (
        <div style={resultsGridStyle}>
          {results.map((item, index) => (
            <div
              key={index}
              style={styles.card}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={
                  item.image_produit_rexel ||
                  item.image_produit_sonepar ||
                  item.image_produit_yesss
                }
                alt={item.nom_produit}
                style={imageStyle}
              />
              <div style={styles.productName}>{item.nom_produit}</div>
              <div style={styles.links}>
                {item.url_produit_rexel && renderLinkBtn(item.url_produit_rexel, 'Rexel')}
                {item.url_produit_sonepar && renderLinkBtn(item.url_produit_sonepar, 'Sonepar')}
                {item.url_produit_yesss && renderLinkBtn(item.url_produit_yesss, 'Yesss')}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Recherche;
