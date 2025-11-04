const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./ingressos.db', (err) => {
  if (err) throw err;
  console.log('Conectado ao banco de ingressos!');
});

db.run(`CREATE TABLE IF NOT EXISTS ingressos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  tipo TEXT NOT NULL, 
  acessos_restantes INTEGER,
  data_validade TEXT,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
)`);

app.post('/ingressos', (req, res) => {
  const { usuario_id, tipo, acessos_restantes, data_validade } = req.body;
  db.run(`INSERT INTO ingressos (usuario_id, tipo, acessos_restantes, data_validade) VALUES (?, ?, ?, ?)`,
    [usuario_id, tipo, acessos_restantes, data_validade],
    (err) => {
      if (err) return res.status(500).send('Erro ao cadastrar ingresso.');
      res.status(201).send('Ingresso cadastrado com sucesso!');
    });
});

app.get('/ingressos', (req, res) => {
  db.all(`SELECT * FROM ingressos`, [], (err, rows) => {
    if (err) return res.status(500).send('Erro ao listar ingressos.');
    res.json(rows);
  });
});

app.listen(3003, () => console.log('Controle de ingressos na porta 3003'));
