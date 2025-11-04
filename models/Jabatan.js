const connection = require('../configs/database')

class Jabatan {
    static async getAll() {
        try {
            const [rows] = await connection.query('SELECT * FROM jabatan')
            return rows
        } catch (err) {
            throw err
        }
    }

    static async checkNamaJabatanStore(data) {
        try {
            const [rows] = await connection.query('SELECT id FROM jabatan WHERE nama_jabatan = ?', [data.nama_jabatan])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [result] = await connection.query('INSERT INTO jabatan set ?', [data])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM jabatan WHERE id = ?', [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async checkNamaJabatanUpdate(data, id) {
        try {
            const [rows] = await connection.query('SELECT id FROM jabatan WHERE nama_jabatan = ? AND id != ?', [data.nama_jabatan, id])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async update(id, data) {
        try {
            const [result] = await connection.query('UPDATE jabatan SET ? WHERE id = ?', [data, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async checkJabatanUsed(id) {
        try {
            const [rows] = await connection.query('SELECT id_jabatan FROM pegawai_jabatan WHERE id_jabatan = ?', [id])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query('DELETE FROM jabatan WHERE id = ?', [id])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = Jabatan