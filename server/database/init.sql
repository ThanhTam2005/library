IF DB_ID('document_storage') IS NULL
BEGIN
    CREATE DATABASE document_storage;
END
GO

USE document_storage;
GO

IF OBJECT_ID('documents', 'U') IS NOT NULL
    DROP TABLE documents;
GO

IF OBJECT_ID('folders', 'U') IS NOT NULL
    DROP TABLE folders;
GO

IF OBJECT_ID('users', 'U') IS NOT NULL
    DROP TABLE users;
GO

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE folders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    parent_id INT NULL,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_folders_owner
        FOREIGN KEY (owner_id) REFERENCES users(id),

    CONSTRAINT FK_folders_parent
        FOREIGN KEY (parent_id) REFERENCES folders(id)
);
GO

CREATE TABLE documents (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    original_name NVARCHAR(255) NULL,
    type VARCHAR(50) NOT NULL,
    size BIGINT NULL,
    file_path NVARCHAR(500) NOT NULL,
    folder_id INT NULL,
    owner_id INT NOT NULL,
    description NVARCHAR(MAX) NULL,
    is_favorite BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT CK_documents_type
        CHECK (type IN ('DOC', 'PDF')),

    CONSTRAINT FK_documents_owner
        FOREIGN KEY (owner_id) REFERENCES users(id),

    CONSTRAINT FK_documents_folder
        FOREIGN KEY (folder_id) REFERENCES folders(id)
);
GO

INSERT INTO users (name, email, password, role)
VALUES
(N'Thanh', 'thanh123@gmail.com', '123abc', 'USER'),
(N'Nguyễn An', 'vanan@gmail.com', '1234ab', 'USER'),
(N'Admin', 'admin@gmail.com', 'admin123', 'ADMIN');
GO

INSERT INTO folders (name, parent_id, owner_id)
VALUES
(N'Tài liệu học tập', NULL, 1),
(N'Dự án tốt nghiệp', NULL, 1),
(N'Báo cáo', 2, 1),
(N'Tài liệu cá nhân', NULL, 2);
GO

INSERT INTO documents
(name, original_name, type, size, file_path, folder_id, owner_id, description, is_favorite)
VALUES
(N'Tài liệu yêu cầu hệ thống.doc', 
 N'tailieu_yeucau_hethong.doc', 
 'DOC', 
 180000, 
 N'uploads/tailieu_yeucau_hethong.doc', 
 1, 
 1, 
 N'Tài liệu mô tả yêu cầu chức năng và phi chức năng của hệ thống quản lý tài liệu.', 
 0),

(N'Hướng dẫn sử dụng hệ thống.pdf', 
 N'huongdan_sudung_hethong.pdf', 
 'PDF', 
 260000, 
 N'uploads/huongdan_sudung_hethong.pdf', 
 1, 
 1, 
 N'Tài liệu hướng dẫn người dùng đăng nhập, tìm kiếm, tải lên và quản lý tài liệu cá nhân.', 
 0),

(N'Quy định nộp tài liệu.pdf', 
 N'quydinh_nop_tailieu.pdf', 
 'PDF', 
 190000, 
 N'uploads/quydinh_nop_tailieu.pdf', 
 2, 
 1, 
 N'Tài liệu quy định về định dạng, dung lượng và cách đặt tên khi nộp tài liệu lên hệ thống.', 
 0),

(N'Biên bản họp nhóm.doc', 
 N'bienban_hopnhom.doc', 
 'DOC', 
 145000, 
 N'uploads/bienban_hopnhom.doc', 
 3, 
 1, 
 N'Tài liệu ghi lại nội dung họp nhóm, phân công công việc và tiến độ thực hiện.', 
 0),

(N'Phiếu đánh giá tài liệu.pdf', 
 N'phieu_danhgia_tailieu.pdf', 
 'PDF', 
 210000, 
 N'uploads/phieu_danhgia_tailieu.pdf', 
 2, 
 1,
 N'Biểu mẫu dùng để đánh giá nội dung, chất lượng và mức độ phù hợp của tài liệu.', 
 1);
GO

SELECT * FROM users;
SELECT * FROM folders;
SELECT * FROM documents;
GO