// Inicia o Express.js
const express = require('express');
const app = express();

// Body Parser - usado para processar dados da requisição HTTP
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Método HTTP GET /hello - envia a mensagem: Hello World
app.get('/base', (req, res) => {
 res.send('Página base do sistema de Parque');
});

// Inicia o Servidor na porta 8090
let porta = 8090;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

// parte 2 

// Importa o package do SQLite
const sqlite3 = require('sqlite3');

// Acessa o arquivo com o banco de dados
var db = new sqlite3.Database('./dados.db', (err) => {
        if (err) {
            console.log('ERRO: não foi possível conectar ao SQLite.');
            throw err;
        }
        console.log('Conectado ao SQLite!');
    });

// Cria a tabela cadastro, caso ela não exista
db.run(`CREATE TABLE IF NOT EXISTS atracao (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    estadoFuncionamento TEXT NOT NULL
  )`, 
        [], (err) => {
           if (err) {
              console.log('ERRO: não foi possível criar tabela.');
              throw err;
           }
      });    

// parte 3 

// Método HTTP POST /Cadastro - cadastra um novo Atração
app.post('/Cadastro-atracao', (req, res, next) => {
    db.run(`INSERT INTO atracao(id, nome, estadoFuncionamento) VALUES(?,?,?)`, 
         [req.body.id, req.body.nome, req.body.estadoFuncionamento], (err) => {
        if (err) {
            console.log("Error: " + err);
            res.status(500).send('Erro ao cadastrar atracao.', err);
        } else {
            console.log('Atração cadastrado com sucesso!');
            res.status(200).send('Atração cadastrado com sucesso!');
        }
    });
});

// parte 4s

// Método HTTP GET /Cadastro - retorna todos os cadastros
app.get('/Cadastro-atracao', (req, res, next) => {
    db.all(`SELECT * FROM atracao`, [], (err, result) => {
        if (err) {
             console.log("Erro: " + err);
             res.status(500).send('Erro ao obter dados.');
        } else {
            res.status(200).json(result);
        }
    });
});

// Método HTTP GET /Cadastro/:cpf - retorna cadastro do Atração com base no CPF
app.get('/Cadastro/:id', (req, res, next) => {
    db.get( `SELECT * FROM cadastro WHERE id = ?`, 
            req.params.id, (err, result) => {
        if (err) { 
            console.log("Erro: "+err);
            res.status(500).send('Erro ao obter dados.');
        } else if (result == null) {
            console.log("Atração não encontrado.");
            res.status(404).send('Atração não encontrado.');
        } else {
            res.status(200).json(result);
        }
    });
});

// Método HTTP PATCH /Cadastro/:cpf - altera o cadastro de um Atração
app.patch('/Cadastro/:id', (req, res, next) => {
    db.run(`UPDATE cadastro SET nome = COALESCE(?,nome), estadoFuncionamento = COALESCE(?,estadoFuncionamento) WHERE id = ?`,
           [req.body.id, req.body.nome, req.body.estadoFuncionamento], function(err) {
            if (err){
                res.status(500).send('Erro ao alterar dados.');
            } else if (this.changes == 0) {
                console.log("Atração não encontrado.");
                res.status(404).send('Atração não encontrado.');
            } else {
                res.status(200).send('Atração alterado com sucesso!');
            }
    });
});

//Método HTTP DELETE /Cadastro/:cpf - remove um Atração do cadastro
app.delete('/Cadastro/:id', (req, res, next) => {
    db.run(`DELETE FROM cadastro WHERE id = ?`, req.params.id, function(err) {
      if (err){
         res.status(500).send('Erro ao remover Atração.');
      } else if (this.changes == 0) {
         console.log("Atração não encontrado.");
         res.status(404).send('Atração não encontrado.');
      } else {
         res.status(200).send('Atração removido com sucesso!');
      }
   });
});
