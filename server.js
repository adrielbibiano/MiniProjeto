/**
 * server.js
 * * Servidor Express.
 * 1. Inicializa a conexão com o DB.
 * 2. Serve o Front-end (index.html) na rota raiz.
 * 3. Expõe as rotas REST da API.
 */
const express = require('express');
const path = require('path'); // Módulo nativo para manipulação de caminhos
const WeatherService = require('./WeatherService');
const db = require('./db');
const config = require('./config');

const app = express();
// CORREÇÃO: Pegue a porta do Render ou use 3000 para testes locais
const PORT = process.env.PORT || 3000;

// Middlewares
app.use((req, res, next) => {
    // Permite CORS para que o Front-end em qualquer lugar possa consumir
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json());

// -----------------------------------------------------------
// CONFIGURAÇÃO PARA SERVIR O FRONT-END
// -----------------------------------------------------------

// Serve arquivos estáticos (como scripts, css) na raiz
app.use(express.static(path.join(__dirname, '')));

// Rota raiz (/) serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// -----------------------------------------------------------
// ROTAS DA API
// -----------------------------------------------------------

// Rota 1: Obtém os dados climáticos recentes (os 5 dias).
app.get('/api/clima/recentes', async (req, res) => {
    try {
        const city = req.query.cidade || config.DEFAULT_CITY; 
        const data = await WeatherService.getRecentWeatherData(city);
        
        if (data.length === 0) {
            return res.status(404).json({
                status: 'ok',
                mensagem: `Nenhum dado encontrado para ${city}. Execute a rota /api/clima/atualizar primeiro.`,
                dados: []
            });
        }

        return res.status(200).json({
            status: 'ok',
            mensagem: 'Dados climáticos obtidos do PostgreSQL com sucesso.',
            dados: data
        });
    } catch (error) {
        console.error('Erro na rota /api/clima/recentes:', error);
        return res.status(500).json({ status: 'erro', mensagem: 'Falha interna do servidor ao consultar o DB.' });
    }
});

// Rota 2: Busca dados na OpenWeather e salva no PostgreSQL
app.post('/api/clima/atualizar', async (req, res) => {
    try {
        const city = req.body.cidade || config.DEFAULT_CITY;
        
        console.log(`Iniciando busca real na OpenWeather para ${city}...`);
        
        const savedData = await WeatherService.fetchAndSaveLatestData(city);
        
        return res.status(200).json({
            status: 'ok',
            mensagem: `Dados de ${city} buscados na OpenWeather e salvos no PostgreSQL.`,
            registro: savedData
        });
    } catch (error) {
        console.error('Erro na rota /api/clima/atualizar:', error.message);
        const statusCode = error.message.includes('não configurada') ? 400 : 500;
        return res.status(statusCode).json({ status: 'erro', mensagem: error.message });
    }
});


// Inicialização da Aplicação
async function startServer() {
    // Tenta conectar e criar a tabela antes de subir o servidor
    await db.initializeDatabase(); 
    
    app.listen(PORT, () => {
        console.log(`Servidor de API rodando na porta ${PORT}`);
    });
}

// Inicia o servidor
startServer();
