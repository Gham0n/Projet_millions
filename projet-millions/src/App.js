import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NavTabs from './components/NavTabs';
import Content from './components/Content';
import Recherche from './components/Recherche';

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f4f8',
  },
  banner: {
    backgroundColor: '#3c4b57',
    color: '#cce0ff',
    padding: '8px',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
};

function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  // Cette fonction est appelée depuis Header (ou un autre composant)
  const handleSearch = (term) => {
    setSearchTerm(term);
    setTriggerSearch(true);
    setActiveTab('recherche'); // Optionnel : bascule sur l’onglet recherche si besoin
  };

  return (
    <div style={styles.container}>
      <Header onSearch={handleSearch} />
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={styles.banner}>
        2HBC, un accès simple à des prix groupés. Pensé pour les artisans, porté par les artisans.
      </div>

      {/* Si triggerSearch est true, on affiche la recherche */}
      {activeTab === 'recherche' ? (
        <Recherche
          searchTerm={searchTerm}
          triggerSearch={triggerSearch}
          setTriggerSearch={setTriggerSearch}
        />
      ) : (
        <Content activeTab={activeTab} />
      )}

      <Footer />
    </div>
  );
}

export default App;
