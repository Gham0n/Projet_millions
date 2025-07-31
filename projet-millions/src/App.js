import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NavTabs from './components/NavTabs';
import Content from './components/Content';

function App() {
  const [activeTab, setActiveTab] = useState('accueil');

  return (
    <div style={styles.container}>
      <Header />
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <Content activeTab={activeTab} />
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f4f8',
  },
};

export default App;
