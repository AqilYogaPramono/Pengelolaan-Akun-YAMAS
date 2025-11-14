const connection = require('../configs/database')
const bcrypt = require('bcryptjs')

class Pegawai {
    static async checkNP(data) {
        try {
            const [rows] = await connection.query('SELECT nomor_pegawai FROM pegawai WHERE nomor_pegawai = ?',[data.nomor_pegawai])
            return rows.length == 0
        } catch (err) {
            throw err
        }
    }

    static async getAllByNP(data) {
        try {
            const [rows] = await connection.query('SELECT * FROM pegawai WHERE nomor_pegawai = ?',[data.nomor_pegawai])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async register(data) {
        try {
            const hashedPassword = await bcrypt.hash(data.kata_sandi, 10)
            const [result] = await connection.query(`update pegawai set kata_sandi = ?, status_akun = 'Proses' where nomor_pegawai = ?`,[hashedPassword, data.nomor_pegawai])
            return result
        } catch (err) {
            throw err
        }
    }

    static async countPegawaiAktif() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(*) AS count_pegawai_aktif FROM pegawai WHERE status_akun = 'Aktif'`)
            return rows[0].count_pegawai_aktif
        } catch (err) {
            throw err
        }
    }

    static async countPegawaiProses() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(*) AS count_pegawai_proses FROM pegawai WHERE status_akun = 'Proses'`)
            return rows[0].count_pegawai_proses
        } catch (err) {
            throw err
        }
    }

    static async countPegawaiNotRegistered() {
        try {
            const [rows] = await connection.query(`SELECT COUNT(*) AS count_pegawai_belum_terdaftar FROM pegawai WHERE status_akun IS NULL and kata_sandi IS NULL`)
            return rows[0].count_pegawai_belum_terdaftar
        } catch (err) {
            throw err
        }
    }

    static async getAll() {
        try {
            const [rows] = await connection.query(`SELECT p.id, p.nama, p.nomor_pegawai, p.status_akun, COALESCE( GROUP_CONCAT( DISTINCT CONCAT(a.nama_aplikasi, ' - ', a.hak_akses) ORDER BY a.nama_aplikasi SEPARATOR ', ' ), '-' ) AS aplikasi FROM pegawai AS p LEFT JOIN pegawai_aplikasi AS pa ON p.id = pa.id_pegawai LEFT JOIN aplikasi AS a ON pa.id_aplikasi = a.id GROUP BY p.id, p.nama, p.nomor_pegawai, p.status_akun ORDER BY p.waktu_dibuat DESC`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [result] = await connection.query(`insert into pegawai set ?`,[data])
            return result
        } catch (err) {
            throw err
        }
    }

    static async updateStatusAccount(data, id) {
        try {
            const [result] = await connection.query(`update pegawai set status_akun = ? where nomor_pegawai = ?`,[data.status_akun, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query(`delete from pegawai where id = ?`, [id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getLastId() {
        try {
            const [rows] = await connection.query(`SELECT MAX(id) AS id FROM pegawai`)
            console.log(rows[0].id)
            return rows[0].id
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM pegawai WHERE id = ?',[id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async resetPassoword(id)  {
        try {
            const [result] = await connection.query(`update pegawai set status_akun = NULL, kata_sandi = NULL where id = ?`,[id])
            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = Pegawai