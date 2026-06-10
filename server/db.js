const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'document_storage',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log('Kết nối SQL Server thành công');
        return pool;
    } catch (error) {
        console.error('Lỗi kết nối SQL Server:', error);
        throw error;
    }
}

module.exports = {
    sql,
    connectDB
};