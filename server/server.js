const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sql, connectDB } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend API đang chạy');
});

// Lấy tất cả tài liệu từ SQL Server
app.get('/api/documents', async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
      SELECT 
        d.id,
        d.name,
        d.original_name,
        d.type,
        d.size,
        d.file_path,
        d.folder_id,
        d.owner_id,
        d.description,
        d.is_favorite,
        d.created_at,
        d.updated_at,
        f.name AS folder_name,
        u.fullName AS owner_name
      FROM documents d
      LEFT JOIN folders f ON d.folder_id = f.id
      LEFT JOIN users u ON d.owner_id = u.id
      ORDER BY d.created_at DESC
    `);

        res.json(result.recordset);

    } catch (error) {
        console.error('Lỗi lấy documents:', error);

        res.status(500).json({
            message: 'Lỗi lấy danh sách tài liệu',
            error: error.message
        });
    }
});

// Lấy tài liệu của tôi theo userId
app.get('/api/my-documents/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const pool = await connectDB();

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
        SELECT 
          d.id,
          d.name,
          d.original_name,
          d.type,
          d.size,
          d.file_path,
          d.folder_id,
          d.owner_id,
          d.description,
          d.is_favorite,
          d.created_at,
          d.updated_at,
          f.name AS folder_name,
          u.fullName AS owner_name
        FROM documents d
        LEFT JOIN folders f ON d.folder_id = f.id
        LEFT JOIN users u ON d.owner_id = u.id
        WHERE d.owner_id = @userId
        ORDER BY d.created_at DESC
      `);

        res.json(result.recordset);

    } catch (error) {
        console.error('Lỗi lấy tài liệu của tôi:', error);

        res.status(500).json({
            message: 'Lỗi lấy tài liệu của tôi',
            error: error.message
        });
    }
});

// Tìm kiếm tài liệu
app.get('/api/documents/search', async (req, res) => {
    try {
        const keyword = req.query.keyword || '';

        const pool = await connectDB();

        const result = await pool.request()
            .input('keyword', sql.NVarChar, `%${keyword}%`)
            .query(`
        SELECT 
          d.id,
          d.name,
          d.original_name,
          d.type,
          d.size,
          d.file_path,
          d.folder_id,
          d.owner_id,
          d.description,
          d.is_favorite,
          d.created_at,
          d.updated_at,
          f.name AS folder_name,
          u.fullName AS owner_name
        FROM documents d
        LEFT JOIN folders f ON d.folder_id = f.id
        LEFT JOIN users u ON d.owner_id = u.id
        WHERE d.name LIKE @keyword
           OR d.original_name LIKE @keyword
           OR d.type LIKE @keyword
           OR d.description LIKE @keyword
           OR f.name LIKE @keyword
        ORDER BY d.created_at DESC
      `);

        res.json(result.recordset);

    } catch (error) {
        console.error('Lỗi tìm kiếm documents:', error);

        res.status(500).json({
            message: 'Lỗi tìm kiếm tài liệu',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.get('/api/users', async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
      SELECT 
        id,
        fullName,
        email,
        role,
        created_at
      FROM users
      ORDER BY id ASC
    `);

        res.json(result.recordset);

    } catch (error) {
        console.error('Lỗi lấy users:', error);

        res.status(500).json({
            message: 'Lỗi lấy danh sách người dùng',
            error: error.message
        });
    }
});

// Đăng ký người dùng mới
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin'
            });
        }

        const pool = await connectDB();

        // Kiểm tra email đã tồn tại chưa
        const checkUser = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`
        SELECT id FROM users
        WHERE email = @email
      `);

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                message: 'Email đã tồn tại'
            });
        }

        // Thêm user vào database
        await pool.request()
            .input('fullName', sql.NVarChar, fullName)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .input('role', sql.VarChar, 'USER')
            .query(`
        INSERT INTO users (fullName, email, password, role)
        VALUES (@fullName, @email, @password, @role)
      `);

        res.json({
            message: 'Đăng ký thành công'
        });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);

        res.status(500).json({
            message: 'Lỗi đăng ký người dùng',
            error: error.message
        });
    }
});


// Đăng nhập người dùng
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập email và mật khẩu'
            });
        }

        const pool = await connectDB();

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query(`
                SELECT 
                    id,
                    fullName,
                    email,
                    role,
                    created_at
                FROM users
                WHERE email = @email
                  AND password = @password
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                message: 'Sai email hoặc mật khẩu'
            });
        }

        res.json({
            message: 'Đăng nhập thành công',
            user: result.recordset[0]
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);

        res.status(500).json({
            message: 'Lỗi đăng nhập',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});