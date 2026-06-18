const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  connectionString:
    'Driver={ODBC Driver 17 for SQL Server};' +
    'Server=THANHTAM;' +
    'Database=document_storage;' +
    'Trusted_Connection=Yes;' +
    'TrustServerCertificate=Yes;' +
    'Connection Timeout=5;'
};

async function connectDB() {
  try {
    console.log('Đang kết nối SQL Server...');

    const pool = await sql.connect(config);

    console.log('Kết nối SQL Server thành công');
    return pool;
  } catch (error) {
    console.error('Lỗi kết nối SQL Server:', error);
    throw error;
  }
}

module.exports = { sql, connectDB };