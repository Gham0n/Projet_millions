const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/api/recherche-produit', (req, res) => {
  const { refFab } = req.body;
  if (!refFab) {
    return res.status(400).json({ error: 'Référence fabricant manquante' });
  }

  // Lance le script python avec l'argument refFab
  const pythonProcess = spawn('python3', ['./add_in_bdd.py', refFab]);

  let stdoutData = '';
  let stderrData = '';

  pythonProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Erreur script Python', details: stderrData });
    }
    res.json({ result: stdoutData });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
