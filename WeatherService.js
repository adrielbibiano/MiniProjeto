/**
 * WeatherService.js
 * * Contém a lógica de negócios, faz a chamada real à API OpenWeather.
 */
const WeatherRepository = require('./WeatherRepository');
const config = require('./config');
const fetch = require('node-fetch'); 

class WeatherService {
    
    /**
     * Busca e formata dados do banco de dados para a interface.
     * @param {string} city Nome da cidade.
     * @returns {Promise<Array>} Dados climáticos formatados.
     */
    async getRecentWeatherData(city) {
        // Busca os dados brutos do PostgreSQL
        const rawData = await WeatherRepository.findRecentWeather(city);
        
        // Define o fuso horário de Brasília/Recife (GMT-3) - (Correto)
        const options = {
            timeZone: 'America/Sao_Paulo',
            weekday: 'long' // Vamos adicionar o dia da semana
        };

        const timeOptions = {
            timeZone: 'America/Sao_Paulo',
            hour: '2-digit',
            minute: '2-digit'
        }

        // Formata os dados para o formato que a interface vai usar
        const formattedData = rawData.map(item => ({
            id: item.id,
            local: item.cidade,
            temperatura: `${item.temperatura}°C`,
            condicao: item.condicao,
            // Formatação da data/hora CORRIGIDA para o fuso GMT-3
            data: new Date(item.data_hora).toLocaleDateString('pt-BR', options),
            hora: new Date(item.data_hora).toLocaleTimeString('pt-BR', timeOptions),
            icone: item.icone
        }));

        return formattedData;
    }

    /**
     * FUNÇÃO PRINCIPAL: Busca dados da OpenWeather API e salva no PostgreSQL.
     * @param {string} city Nome da cidade (para busca e salvamento).
     */
    async fetchAndSaveLatestData(city = config.DEFAULT_CITY) {
        
        // 1. Busca dados da OpenWeather (agora da API de 'forecast')
        const url = `${config.OPEN_WEATHER_BASE_URL}?q=${city}&appid=${config.OPEN_WEATHER_API_KEY}&units=metric&lang=pt_br`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Falha ao buscar dados na OpenWeather. Status: ${response.status}`);
        }
        
        const apiData = await response.json();

        if (apiData.cod !== "200") {
            throw new Error(`OpenWeather API erro: ${apiData.message}`);
        }

        // 2. Filtra a lista para pegar apenas 1 registro por dia (o do meio-dia)
        const dailyData = apiData.list.filter(item => item.dt_txt.includes("12:00:00"));

        if (!dailyData || dailyData.length === 0) {
            throw new Error("Não foi possível obter dados de previsão filtrados.");
        }

        const savedRecords = [];
        
        // 3. Salva CADA UM dos 5 dias no banco
        for (const day of dailyData) {
            const dataToSave = {
                cidade: apiData.city.name, // O nome da cidade vem do objeto 'city'
                temperatura: day.main.temp.toFixed(1),
                condicao: day.weather[0].description.charAt(0).toUpperCase() + day.weather[0].description.slice(1),
                icone: day.weather[0].icon,
                data_hora: day.dt_txt // O timestamp vem da própria previsão
            };

            const savedData = await WeatherRepository.saveWeather(dataToSave);
            savedRecords.push(savedData);
        }
        
        return { 
            cidade: apiData.city.name, 
            registrosSalvos: savedRecords.length 
        };
    }
}

module.exports = new WeatherService();
