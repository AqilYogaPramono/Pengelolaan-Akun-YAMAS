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
}

module.exports = Pegawai