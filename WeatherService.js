/**
 * WeatherService.js
 * * Contém a lógica de negócios, faz a chamada real à API OpenWeather.
 */
const WeatherRepository = require('./WeatherRepository');
const config = require('./config');
const fetch = require('node-fetch'); // Módulo necessário para fazer requisições HTTP

class WeatherService {
    
    /**
     * Busca e formata dados do banco de dados para a interface.
     * @param {string} city Nome da cidade.
     * @returns {Promise<Array>} Dados climáticos formatados.
     */
    async getRecentWeatherData(city) {
        // Busca os dados brutos do PostgreSQL
        const rawData = await WeatherRepository.findRecentWeather(city);
        
        // Formata os dados para o formato que a interface vai usar
        const formattedData = rawData.map(item => ({
            id: item.id,
            local: item.cidade,
            temperatura: `${item.temperatura}°C`,
            condicao: item.condicao,
            // Formatação da data/hora para leitura no Brasil
            data: new Date(item.data_hora).toLocaleDateString('pt-BR'),
            hora: new Date(item.data_hora).toLocaleTimeString('pt-BR'),
            icone: item.icone
        }));

        return formattedData;
    }

    /**
     * FUNÇÃO PRINCIPAL: Busca dados da OpenWeather API e salva no PostgreSQL.
     * @param {string} city Nome da cidade (para busca e salvamento).
     */
   // WeatherService (1).js

async function fetchAndSaveLatestData(city = config.DEFAULT_CITY) {
    // 1. Busca dados da OpenWeather
    const url = `${config.OPEN_WEATHER_BASE_URL}?q=${city}&appid=${config.OPEN_WEATHER_API_KEY}&units=metric&lang=pt_br`;
    // ...
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Falha ao buscar dados na OpenWeather. Status: ${response.status}`);
        }
        
        const apiData = await response.json();

        if (apiData.cod !== 200) {
            throw new Error(`OpenWeather API erro: ${apiData.message}`);
        }

        // 2. Extrai e Formata para o Banco
        const dataToSave = {
            cidade: apiData.name,
            temperatura: apiData.main.temp.toFixed(1), // Arredonda para 1 casa decimal
            condicao: apiData.weather[0].description.charAt(0).toUpperCase() + apiData.weather[0].description.slice(1), // Capitaliza
            icone: apiData.weather[0].icon
        };

        // 3. Salva no PostgreSQL
        const savedData = await WeatherRepository.saveWeather(dataToSave);
        
        return savedData;
    }
}

module.exports = new WeatherService();
