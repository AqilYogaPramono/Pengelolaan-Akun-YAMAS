CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255),
    nomor_admin VARCHAR(255) UNIQUE,
    kata_sandi VARCHAR(255),
    waktu_dibuat DATETIME DEFAULT CURRENT_TIMESTAMP,
    waktu_diedit DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE aplikasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_aplikasi VARCHAR(255) NOT NULL,
    hak_akses VARCHAR(255) NOT NULL
);

CREATE TABLE pegawai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255),
    nomor_pegawai VARCHAR(255) unique,
    kata_sandi VARCHAR(255),
    status_akun ENUM('Aktif', 'Non-Aktif', 'Proses') DEFAULT NULL,
    waktu_dibuat DATETIME DEFAULT CURRENT_TIMESTAMP,
    waktu_diedit DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pegawai_aplikasi (
    id_pegawai INT,
    id_aplikasi INT,
    FOREIGN KEY (id_pegawai) REFERENCES pegawai(id) ON DELETE CASCADE,
    FOREIGN KEY (id_aplikasi) REFERENCES aplikasi(id) ON DELETE CASCADE
);

CREATE TABLE periode (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pegawai INT unique,
    periode_mulai datetime not null,
    periode_berakhir datetime not null,
    FOREIGN KEY (id_pegawai) REFERENCES pegawai(id) ON DELETE CASCADE
);