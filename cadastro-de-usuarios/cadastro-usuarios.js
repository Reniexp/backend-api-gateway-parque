const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Banco de dados SQLite
const db = new sqlite3.Database('./usuarios.db', (err) => {
  if (err) throw err;
  console.log('Conectado ao banco de usuários!');
});

// Criação da tabela
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL
)`);

// CRUD
app.post('/usuarios', (req, res) => {
  const { nome, email, telefone } = req.body;
  db.run(`INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)`,
    [nome, email, telefone],
    (err) => {
      if (err) return res.status(500).send('Erro ao cadastrar usuário.');
      res.status(201).send('Usuário cadastrado com sucesso!');
    });
});

app.get('/usuarios', (req, res) => {
  db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
    if (err) return res.status(500).send('Erro ao listar usuários.');
    res.json(rows);
  });
});

app.get('/usuarios/:id', (req, res) => {
  db.get(`SELECT * FROM usuarios WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).send('Erro ao buscar usuário.');
    if (!row) return res.status(404).send('Usuário não encontrado.');
    res.json(row);
  });
});

app.listen(3001, () => console.log('Cadastro de usuários na porta 3001'));
