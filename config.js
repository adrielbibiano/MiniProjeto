/**
 * config.js
 * Versão adaptada para o plano Free do Render, usando a URL de Conexão Única.
 */

const config = {
    // Variável que o Render DEVE fornecer, contendo tudo sobre o DB.
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:guypostgre@localhost:5432/clima_db',
    
    // Variáveis da API Externa (OpenWeather)
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY || '835a647d01bf89b72afc0a430535d948',
    OPEN_WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    // O Render injeta a porta PORT automaticamente, não precisamos configurá-la
    DEFAULT_CITY: 'Recife'
};

module.exports = config;
