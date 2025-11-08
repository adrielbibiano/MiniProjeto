/**
 * config.js
 * Configuração para ler Variáveis de Ambiente do Render.
 */

const config = {
    // Lendo a URL do banco de dados (que você deve configurar no Render)
    DATABASE_URL: process.env.DATABASE_URL,
    
    // Lendo a Chave de API (que você deve configurar no Render)
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY,

    // URL base da API
    OPEN_WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    // Cidade padrão
    DEFAULT_CITY: 'Recife'
};

module.exports = config;
