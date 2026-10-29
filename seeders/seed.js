const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const bcrypt = require('bcryptjs')
const connection = require('../configs/database')

const initialAplikasi = require('./data/aplikasi.json')
const initialPegawai = require('./data/pegawai.json')
const initialPegawaiAplikasi = require('./data/pegawai_aplikasi.json')

const requiredTables = ['admin', 'aplikasi', 'pegawai', 'pegawai_aplikasi']

async function validateTables(conn) {
    const [rows] = await conn.query('SHOW TABLES')
    const existingTables = rows.map(row => Object.values(row)[0])
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))

    if (missingTables.length > 0) {
        console.error(`Tabel belum dibuat: ${missingTables.join(', ')}. Silakan buat tabel terlebih dahulu sebelum menjalankan seeder.`)
        process.exit(1)
    }
}

async function truncateTables(conn) {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0')
    await conn.query('TRUNCATE TABLE pegawai_aplikasi')
    await conn.query('TRUNCATE TABLE pegawai')
    await conn.query('TRUNCATE TABLE aplikasi')
    await conn.query('TRUNCATE TABLE admin')
    await conn.query('SET FOREIGN_KEY_CHECKS = 1')
}

async function runSeed() {
    let conn
    const isClear = process.argv.includes('--clear')

    try {
        conn = await connection.getConnection()

        await validateTables(conn)

        if (isClear) {
            await truncateTables(conn)
            console.log('Seluruh data tabel berhasil dibersihkan.')
            process.exit(0)
        }

        await conn.beginTransaction()

        const adminNama = process.env.NAMA_ADMIN
        const adminNomor = process.env.NOMOR_ADMIN
        const adminPassword = process.env.KATA_SANDI_ADMIN

        if (adminNama && adminNomor && adminPassword) {
            const [existing] = await conn.query('SELECT id FROM admin WHERE nomor_admin = ? LIMIT 1', [adminNomor])
            if (existing.length === 0) {
                const hashedPassword = await bcrypt.hash(adminPassword, 10)
                await conn.query('INSERT INTO admin (nama, nomor_admin, kata_sandi) VALUES (?, ?, ?)', [
                    adminNama,
                    adminNomor,
                    hashedPassword
                ])
            }
        }

        for (const app of initialAplikasi) {
            const [existing] = await conn.query(
                'SELECT id FROM aplikasi WHERE nama_aplikasi = ? AND hak_akses = ? LIMIT 1',
                [app.nama_aplikasi, app.hak_akses]
            )
            if (existing.length === 0) {
                await conn.query('INSERT INTO aplikasi (nama_aplikasi, hak_akses) VALUES (?, ?)', [
                    app.nama_aplikasi,
                    app.hak_akses
                ])
            }
        }

        for (const pegawai of initialPegawai) {
            const [existing] = await conn.query('SELECT id FROM pegawai WHERE nomor_pegawai = ? LIMIT 1', [
                pegawai.nomor_pegawai
            ])
            if (existing.length === 0) {
                const hashedPassword = await bcrypt.hash(pegawai.password_raw, 10)
                await conn.query(
                    'INSERT INTO pegawai (nama, nomor_pegawai, kata_sandi, status_akun) VALUES (?, ?, ?, ?)',
                    [pegawai.nama, pegawai.nomor_pegawai, hashedPassword, pegawai.status_akun]
                )
            }
        }

        for (const relation of initialPegawaiAplikasi) {
            const [pegawaiRows] = await conn.query('SELECT id FROM pegawai WHERE nomor_pegawai = ? LIMIT 1', [
                relation.nomor_pegawai
            ])
            const [aplikasiRows] = await conn.query(
                'SELECT id FROM aplikasi WHERE nama_aplikasi = ? AND hak_akses = ? LIMIT 1',
                [relation.nama_aplikasi, relation.hak_akses]
            )

            if (pegawaiRows.length > 0 && aplikasiRows.length > 0) {
                const idPegawai = pegawaiRows[0].id
                const idAplikasi = aplikasiRows[0].id

                const [existing] = await conn.query(
                    'SELECT 1 FROM pegawai_aplikasi WHERE id_pegawai = ? AND id_aplikasi = ? LIMIT 1',
                    [idPegawai, idAplikasi]
                )

                if (existing.length === 0) {
                    await conn.query('INSERT INTO pegawai_aplikasi (id_pegawai, id_aplikasi) VALUES (?, ?)', [
                        idPegawai,
                        idAplikasi
                    ])
                }
            }
        }

        await conn.commit()
        console.log('Seeding selesai dengan sukses.')
        process.exit(0)
    } catch (error) {
        if (conn) {
            await conn.rollback()
        }
        console.error('Seeding gagal:', error)
        process.exit(1)
    } finally {
        if (conn) {
            conn.release()
        }
    }
}

runSeed()
