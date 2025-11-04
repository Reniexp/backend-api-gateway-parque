const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Mapeamento de serviços
const services = {
  usuarios: 'http://localhost:3001',
  atracoes: 'http://localhost:3002',
  ingressos: 'http://localhost:3003',
  filas: 'http://localhost:3004',
  espera: 'http://localhost:3005'
};

// Encaminha requisições para o microserviço correspondente
app.use('/:servico/:rota?', async (req, res) => {
  const { servico, rota } = req.params;
  const url = `${services[servico]}/${rota || ''}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      data: req.body
    });
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(500).send(`Erro ao comunicar com o serviço ${servico}.`);
  }
});

app.listen(3000, () => console.log('API Gateway na porta 3000'));
