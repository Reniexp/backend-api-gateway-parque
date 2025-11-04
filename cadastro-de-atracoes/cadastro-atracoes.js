const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./atracoes.db', (err) => {
  if (err) throw err;
  console.log('Conectado ao banco de atrações!');
});

db.run(`CREATE TABLE IF NOT EXISTS atracoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  capacidade INTEGER NOT NULL,
  duracao_ciclo_minutos REAL NOT NULL,
  estadoFuncionamento TEXT NOT NULL
)`);

app.post('/atracoes', (req, res) => {
  const { nome, capacidade, duracao_ciclo_minutos, estadoFuncionamento } = req.body;
  db.run(`INSERT INTO atracoes (nome, capacidade, duracao_ciclo_minutos, estadoFuncionamento) VALUES (?, ?, ?, ?)`,
    [nome, capacidade, duracao_ciclo_minutos, estadoFuncionamento],
    (err) => {
      if (err) return res.status(500).send('Erro ao cadastrar atração.');
      res.status(201).send('Atração cadastrada com sucesso!');
    });
});

app.get('/atracoes', (req, res) => {
  db.all(`SELECT * FROM atracoes`, [], (err, rows) => {
    if (err) return res.status(500).send('Erro ao listar atrações.');
    res.json(rows);
  });
});

app.listen(3002, () => console.log('Cadastro de atrações na porta 3002'));
