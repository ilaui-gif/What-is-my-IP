const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;
const IPS_FILE = path.join(__dirname, 'ips.json');

app.use(express.json());
app.use(express.static(__dirname));

// Lade existierende IPs oder erstelle eine neue Liste
function loadIPs() {
  if (fs.existsSync(IPS_FILE)) {
    const data = fs.readFileSync(IPS_FILE, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// Speichere IPs in Datei
function saveIPs(ips) {
  fs.writeFileSync(IPS_FILE, JSON.stringify(ips, null, 2));
}

// Endpoint zum Speichern einer IP
app.post('/api/save-ip', (req, res) => {
  const { ip } = req.body;
  
  if (!ip) {
    return res.status(400).json({ error: 'IP erforderlich' });
  }
  
  const ips = loadIPs();
  const timestamp = new Date().toLocaleString('de-DE');
  
  ips.push({
    ip: ip,
    time: timestamp
  });
  
  saveIPs(ips);
  res.json({ success: true, message: 'IP gespeichert' });
});

// Endpoint zum Abrufen aller IPs
app.get('/api/get-ips', (req, res) => {
  const ips = loadIPs();
  res.json(ips);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
