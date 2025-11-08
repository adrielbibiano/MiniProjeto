/**
 * WeatherRepository.js
 * * Camada de acesso a dados usando comandos SQL reais no PostgreSQL.
 */

const db = require('./db');

class WeatherRepository {
    
    /**
     * Busca os últimos 5 registros de clima para uma cidade, ordenados pelo mais recente.
     * @param {string} city Nome da cidade.
     * @returns {Promise<Array>} Lista de dados climáticos.
     */
    async findRecentWeather(city) {
        const query = `
            SELECT id, cidade, temperatura, condicao, data_hora, icone 
            FROM weather_data 
            WHERE cidade ILIKE $1 
            -- MUDANÇA AQUI: Ordena ASC para mostrar a previsão em ordem cronológica
            ORDER BY data_hora ASC 
            LIMIT 5;
        `;
        const { rows } = await db.query(query, [city]);
        return rows;
    }

    /**
     * Salva um novo registro no banco de dados.
     * @param {Object} data O objeto de dados climáticos a ser salvo.
     */
    // MUDANÇA AQUI: A função agora espera 'data_hora'
    async saveWeather({ cidade, temperatura, condicao, icone, data_hora }) {
        const query = `
            -- MUDANÇA AQUI: Adiciona a coluna 'data_hora'
            INSERT INTO weather_data (cidade, temperatura, condicao, icone, data_hora)
            -- MUDANÇA AQUI: Adiciona o parâmetro '$5'
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        // MUDANÇA AQUI: Passa 'data_hora' para a query
        const { rows } = await db.query(query, [cidade, temperatura, condicao, icone, data_hora]);
        return rows[0];
    }
}

module.exports = new WeatherRepository();
