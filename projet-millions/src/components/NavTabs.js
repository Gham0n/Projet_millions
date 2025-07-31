import React from 'react';

const styles = {
  nav: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    backgroundColor: '#0070f3',
    padding: '10px 0',
  },
  navButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#cce0ff',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  activeNavButton: {
    backgroundColor: '#3641dbff',
    color: '#fff',
  },
};

export default function NavTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'recherche', label: 'Recherche' },
    { id: 'contact', label: 'Contact' },
    { id: 'apropos', label: 'À propos' },
  ];

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            ...styles.navButton,
            ...(activeTab === tab.id ? styles.activeNavButton : {}),
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
