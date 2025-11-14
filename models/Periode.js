const connection = require('../configs/database')

class Periode {
    static async getAll() {
        try {
            const [rows] = await connection.query(`SELECT pr.id, pr.id_pegawai, pr.periode_mulai, pr.periode_berakhir, pg.nama FROM periode pr LEFT JOIN pegawai pg ON pg.id = pr.id_pegawai ORDER BY pr.periode_mulai DESC
            `)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [result] = await connection.query('INSERT INTO periode set ?', [data])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query(`SELECT pr.id, pr.id_pegawai, pr.periode_mulai, pr.periode_berakhir, pg.nama FROM periode pr LEFT JOIN pegawai pg ON pg.id = pr.id_pegawai WHERE pr.id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async update(data, id) {
        try {
            const [result] = await connection.query('UPDATE periode SET ? WHERE id = ?', [data, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query('DELETE FROM periode WHERE id = ?', [id])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = Periode