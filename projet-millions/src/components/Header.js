import React from 'react';

const styles = {
  header: {
    backgroundColor: '#3641dbff',
    padding: '15px 30px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    color: '#fff',
    fontSize: '28px',
  },
};

export default function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Projet Millions</h1>
    </header>
  );
}
