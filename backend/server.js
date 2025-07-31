console.log("🔥 Serveur démarré");

const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const csv = require('csv-parser');


const app = express();
const PORT = 4000;
const cors = require('cors');
app.use(cors());  // Autorise toutes les origines par défaut

app.use(express.json());

const csvFilePath = path.join(__dirname, 'produits.csv');
const pythonPath = path.join(__dirname, 'venv/bin/python');
const scriptPath = path.join(__dirname, 'add_in_bdd.py');

console.log("Lecture du fichier CSV :", csvFilePath);

console.log('Fichier CSV existe ?', fs.existsSync(csvFilePath));

// Fonction pour lire dans le CSV
function findProductInCSV(refFab = '') {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvFilePath)
      .on('error', reject)
      .pipe(csv())
      .on('data', (data) => {
        if (!refFab || data['référence_fabricant'] === refFab) {
          results.push(data);
        }
      })
      .on('end', () => resolve(results));
  });
}


app.post('/api/recherche-produit', async (req, res) => {
  const refFab = req.body.refFab?.trim() || '';
  console.log(`Recherche de la référence : "${refFab}"`);

  // Si ref vide → retourner toute la BDD sans passer par le script Python
  if (refFab === '') {
    try {
      const allProducts = await findProductInCSV();
      console.log(`→ ${allProducts.length} produits retournés (base complète)`);
      return res.json({ result: allProducts });
    } catch (error) {
      console.error('Erreur lecture CSV:', error);
      return res.status(500).json({ error: 'Erreur lecture CSV' });
    }
  }

  // Sinon, chercher dans le CSV
  try {
    let results = await findProductInCSV(refFab);
    if (results.length > 0) {
      console.log(`→ Produit trouvé dans CSV`);
      return res.json({ result: results });
    }
  } catch (error) {
    console.error('Erreur lecture CSV:', error);
    return res.status(500).json({ error: 'Erreur lecture CSV' });
  }

  // Si pas trouvé, lancer le script Python
  console.log('Produit non trouvé, lancement du script Python...');
  const pythonProcess = spawn(pythonPath, [scriptPath, refFab]);

  pythonProcess.on('close', async (code) => {
    console.log(`Script Python terminé avec le code ${code}`);
    if (code !== 0) {
      return res.status(500).json({ error: 'Erreur script Python' });
    }

    // Recherche après mise à jour
    try {
      const updatedResults = await findProductInCSV(refFab);
      if (updatedResults.length > 0) {
        return res.json({ result: updatedResults });
      } else {
        return res.status(404).json({ result: [] });
      }
    } catch (error) {
      console.error('Erreur après script:', error);
      return res.status(500).json({ error: 'Erreur lecture CSV après script' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Serveur backend en écoute sur http://localhost:${PORT}`);
});
