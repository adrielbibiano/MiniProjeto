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
            ORDER BY data_hora DESC 
            LIMIT 5;
        `;
        const { rows } = await db.query(query, [city]);
        return rows;
    }

    /**
     * Salva um novo registro no banco de dados.
     * @param {Object} data O objeto de dados climáticos a ser salvo.
     */
    async saveWeather({ cidade, temperatura, condicao, icone }) {
        const query = `
            INSERT INTO weather_data (cidade, temperatura, condicao, icone)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const { rows } = await db.query(query, [cidade, temperatura, condicao, icone]);
        return rows[0];
    }
}

module.exports = new WeatherRepository();
