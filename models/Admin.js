const connection = require('../configs/database')

class Admin {
    static async login(data) {
        try {
            const [rows] = await connection.query(`select * from admin where nomor_admin = ? `, [data.nomor_admin])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getNA(id) {
        try {
            const [rows] = await connection.query(`select nomor_admin from admin where id = ? `, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }
}

module.exports = Admin