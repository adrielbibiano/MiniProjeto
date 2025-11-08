/**
 * config.js
 * Versão adaptada para o plano Free do Render, usando a URL de Conexão Única.
 */

// config (1).js

const config = {
    DATABASE_URL: process.env.DATABASE_URL, // Deixe o Render controlar isso
    
    OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY, // Apenas leia a variável
    OPEN_WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    DEFAULT_CITY: 'Recife'
};
    OPEN_WEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    // O Render injeta a porta PORT automaticamente, não precisamos configurá-la
    DEFAULT_CITY: 'Recife'
};

module.exports = config;
