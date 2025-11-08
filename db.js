// db.js
// Configura e exporta o pool de conexão real com o PostgreSQL.
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_DATABASE,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    // Adiciona SSL para conexão com o Render (apenas se DB estiver na nuvem)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
                data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                icone VARCHAR(10)
            );
        `;
        await client.query(createTableQuery);
        console.log('PostgreSQL: Tabela weather_data verificada/criada.');
        client.release();
    } catch (error) {
        // Se o DB não puder ser acessado, loga o erro para o Render
        console.error('ERRO CRÍTICO ao inicializar o banco de dados:', error.message);
        console.error('Verifique suas credenciais de DB no config.js/ambiente.');
        // Em um ambiente de produção real, você poderia travar o processo aqui.
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    initializeDatabase
};
