// config.js
// Este arquivo carrega variáveis de ambiente, essenciais para o Render.
// No ambiente de produção (Render), elas serão definidas lá.
// NOTA: Você deve configurar estas variáveis no painel do Render.
// Localmente, você pode usar um arquivo .env (não incluso) ou modificar as defaults.

const config = {
    // Variáveis do PostgreSQL (DB)
    // ATENÇÃO: Use os valores fornecidos pelo seu serviço de DB no Render
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'guypostgre', // Use uma senha real!
    DB_DATABASE: process.env.DB_DATABASE || 'clima_db',

    // Variáveis da API Externa (OpenWeather)
    // ATENÇÃO: SUBSTITUA 'SUA_CHAVE_AQUI' pela sua chave real antes de rodar localmente.
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY || 'SUA_CHAVE_AQUI',
    OPEN_WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    // Configurações do Servidor
    PORT: process.env.PORT || 3000,
    DEFAULT_CITY: 'Recife'
};

module.exports = config;
