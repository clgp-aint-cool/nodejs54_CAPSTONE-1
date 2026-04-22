
USE capstone1;

-- 1. Table: nguoi_dung (Users)
CREATE TABLE nguoi_dung (
    nguoi_dung_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(255),
    tuoi INT,
    anh_dai_dien VARCHAR(255)
);

-- 2. Table: hinh_anh (Images)
CREATE TABLE hinh_anh (
    hinh_id INT AUTO_INCREMENT PRIMARY KEY,
    ten_hinh VARCHAR(255),
    duong_dan VARCHAR(255),
    mo_ta VARCHAR(255),
    nguoi_dung_id INT,
    CONSTRAINT fk_hinh_nguoi_dung FOREIGN KEY (nguoi_dung_id) 
        REFERENCES nguoi_dung(nguoi_dung_id) ON DELETE CASCADE
);

-- 3. Table: binh_luan (Comments)
CREATE TABLE binh_luan (
    binh_luan_id INT AUTO_INCREMENT PRIMARY KEY,
    nguoi_dung_id INT,
    hinh_id INT,
    ngay_binh_luan DATE,
    noi_dung VARCHAR(255),
    CONSTRAINT fk_bl_nguoi_dung FOREIGN KEY (nguoi_dung_id) 
        REFERENCES nguoi_dung(nguoi_dung_id) ON DELETE CASCADE,
    CONSTRAINT fk_bl_hinh_anh FOREIGN KEY (hinh_id) 
        REFERENCES hinh_anh(hinh_id) ON DELETE CASCADE
);

-- 4. Table: luu_anh (Saved Images - Many-to-Many junction)
CREATE TABLE luu_anh (
    nguoi_dung_id INT,
    hinh_id INT,
    ngay_luu DATE,
    PRIMARY KEY (nguoi_dung_id, hinh_id),
    CONSTRAINT fk_luu_nguoi_dung FOREIGN KEY (nguoi_dung_id) 
        REFERENCES nguoi_dung(nguoi_dung_id) ON DELETE CASCADE,
    CONSTRAINT fk_luu_hinh_anh FOREIGN KEY (hinh_id) 
        REFERENCES hinh_anh(hinh_id) ON DELETE CASCADE
);