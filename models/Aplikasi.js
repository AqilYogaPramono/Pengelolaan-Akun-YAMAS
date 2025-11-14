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

    static async checkStore(data) {
        try {
            console.log(data)
            const [rows] = await connection.query('select id from aplikasi where nama_aplikasi = ? and hak_akses = ?', [data.nama_aplikasi, data.hak_akses])
            console.log(rows)
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

    static async checkUpdate(data, id) {
        try {
            console.log(data)
            const [rows] = await connection.query('select id from aplikasi where nama_aplikasi = ? and hak_akses = ? and id != ?', [data.nama_aplikasi, data.hak_akses, id])
            console.log(rows)
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

    static async getAplikasiByPegawai(id_pegawai) {
        try {
            const [rows] = await connection.query('SELECT id_aplikasi FROM pegawai_aplikasi WHERE id_pegawai = ?', [id_pegawai])
            return rows.map(row => row.id_aplikasi)
        } catch (err) {
            throw err
        }
    }

    static async deleteAllPegawaiAplikasi(id_pegawai) {
        try {
            const [result] = await connection.query('DELETE FROM pegawai_aplikasi WHERE id_pegawai = ?', [id_pegawai])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = Aplikasi