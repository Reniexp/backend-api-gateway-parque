const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('./filas.db', (err) => {
  if (err) throw err;
  console.log('Conectado ao banco de filas!');
});

db.run(`CREATE TABLE IF NOT EXISTS filas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atracao_id INTEGER NOT NULL,
  pessoas_na_fila INTEGER DEFAULT 0,
  ultima_atualizacao TEXT DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/filas/atualizar', (req, res) => {
  const { atracao_id, pessoas_na_fila } = req.body;
  db.run(`UPDATE filas SET pessoas_na_fila = ?, ultima_atualizacao = CURRENT_TIMESTAMP WHERE atracao_id = ?`,
    [pessoas_na_fila, atracao_id],
    function (err) {
      if (err) return res.status(500).send('Erro ao atualizar fila.');
      if (this.changes === 0) {
        db.run(`INSERT INTO filas (atracao_id, pessoas_na_fila) VALUES (?, ?)`, [atracao_id, pessoas_na_fila]);
      }
      res.status(200).send('Fila atualizada com sucesso!');
    });
});

app.get('/filas', (req, res) => {
  db.all(`SELECT * FROM filas`, [], (err, rows) => {
    if (err) return res.status(500).send('Erro ao listar filas.');
    res.json(rows);
  });
});

app.listen(3004, () => console.log('Controle de filas na porta 3004'));
