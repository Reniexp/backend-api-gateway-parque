const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbAtracoes = new sqlite3.Database('../cadastro-de-atracoes/atracoes.db');
const dbFilas = new sqlite3.Database('../controle-de-filas/filas.db');

app.get('/espera/:atracao_id', (req, res) => {
  const id = req.params.atracao_id;

  dbAtracoes.get(`SELECT * FROM atracoes WHERE id = ?`, [id], (err, atracao) => {
    if (err || !atracao) return res.status(404).send('Atração não encontrada.');

    dbFilas.get(`SELECT pessoas_na_fila FROM filas WHERE atracao_id = ?`, [id], (err, fila) => {
      const pessoas = fila ? fila.pessoas_na_fila : 0;
      const ciclos = Math.ceil(pessoas / atracao.capacidade);
      const tempoEstimado = ciclos * atracao.duracao_ciclo_minutos;

      res.json({
        atracao: atracao.nome,
        pessoas_na_fila: pessoas,
        tempo_estimado_minutos: tempoEstimado,
      });
    });
  });
});

app.listen(3005, () => console.log('Estimador de espera na porta 3005'));
