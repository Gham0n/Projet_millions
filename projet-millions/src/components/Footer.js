import React from 'react';

const styles = {
  footer: {
    textAlign: 'center',
    padding: '15px 0',
    backgroundColor: '#3641dbff',
    color: '#fff',
    marginTop: 'auto',
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      &copy; 2025 Projet Millions - Tous droits réservés
    </footer>
  );
}
