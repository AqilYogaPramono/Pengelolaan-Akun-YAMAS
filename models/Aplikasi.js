const connection = require('../configs/database')

class Aplikasi {
    static async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM aplikasi')
            return rows
        } catch (err) {
            throw err
        }
    }

    static async checkNamaAplikasiStore(data) {
        try {
            const [rows] = await connection.query('SELECT id FROM aplikasi WHERE nama_aplikasi = ?', [data.nama_aplikasi])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [result] = await connection.query('INSERT INTO aplikasi set ?', [data])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM aplikasi WHERE id = ?', [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async checkNamaAplikasiUpdate(data, id) {
        try {
            const [rows] = await connection.query('SELECT id FROM aplikasi WHERE nama_aplikasi = ? AND id != ?', [data.nama_aplikasi, id])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async update(data, id) {
        try {
            const [result] = await connection.query('UPDATE aplikasi SET ? WHERE id = ?', [data, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async checkAplikasiUsed(id) {
        try {
            const [rows] = await connection.query('SELECT id_aplikasi FROM pegawai_aplikasi WHERE id_aplikasi = ?', [id])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query('DELETE FROM aplikasi WHERE id = ?', [id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async storePegawaiAplikasi(id_pegawai, id_aplikasi) {
        try {
            const [result] = await connection.query('INSERT INTO pegawai_aplikasi (id_pegawai, id_aplikasi) VALUES (?, ?)', [id_pegawai, id_aplikasi])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = Aplikasi