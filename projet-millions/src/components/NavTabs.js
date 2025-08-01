import React from 'react';

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#00a8cc',
    padding: '8px 0',
    gap: '40px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  active: {
    backgroundColor: '#005163ff',
  },
};

export default function NavTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'nos produits', label: 'Nos produits' },
    { id: 'nouveau', label: 'Nouveau' },
    { id: 'partenaires', label: 'Nos partenaires' },
  ];

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            ...styles.link,
            ...(activeTab === tab.id ? styles.active : {}),
          }}
        >
          {tab.label}
        </div>
      ))}
    </nav>
  );
}
