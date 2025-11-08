// db.js
// Configura e exporta o pool de conexão real, usando a URL única do Render.
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
    connectionString: config.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Verifica a conexão e cria a tabela se não existir
async function initializeDatabase() {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL: Conexão bem-sucedida.');
        
        // Comando SQL para criar a tabela weather_data
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS weather_data (
                id SERIAL PRIMARY KEY,
                cidade VARCHAR(100) NOT NULL,
                temperatura NUMERIC(4,1) NOT NULL,
                condicao VARCHAR(50) NOT NULL,
                
                -- MUDANÇA AQUI: Removemos o DEFAULT, pois a API vai fornecer a data
                data_hora TIMESTAMP WITH TIME ZONE NOT NULL, 
                
                icone VARCHAR(10)
            );
        `;
        await client.query(createTableQuery);
        console.log('PostgreSQL: Tabela weather_data verificada/criada.');
        client.release();
    } catch (error) {
        console.error('ERRO CRÍTICO ao inicializar o banco de dados:', error.message);
        console.error('Verifique a variável DATABASE_URL no Render!');
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    initializeDatabase
};
