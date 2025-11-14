const express = require('express')

const Admin = require('../../models/Admin')
const Aplikasi = require('../../models/Aplikasi')
const { authAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const aplikasi = await Aplikasi.getAll()

        res.render('admins/aplikasi/index', {admin, aplikasi})
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.get('/buat', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)

        res.render('admins/aplikasi/create', {
            admin,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/aplikasi')
    }
})

router.post('/create', authAdmin, async (req, res) => {
    try {
        const { nama_aplikasi, hak_akses } = req.body
        const data = { nama_aplikasi, hak_akses }

        if (!nama_aplikasi) {
            req.flash('error', 'Nama Aplikasi wajib diisi')
            req.flash('data', data)
            return res.redirect('/admin/aplikasi/buat')
        }

        if (!hak_akses) {
            req.flash('error', 'Hak Akses wajib diisi')
            req.flash('data', data)
            return res.redirect('/admin/aplikasi/buat')
        }

        if (await Aplikasi.checkNamaAplikasiStore(data)) {
            req.flash('error', 'Nama Aplikasi sudah ditambahkan sebelumnya')
            req.flash('data', data)
            return res.redirect('/admin/aplikasi/buat')
        }

        await Aplikasi.store(data)
        req.flash('success', 'Aplikasi berhasil dibuat')
        res.redirect('/admin/aplikasi')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/aplikasi')
    }
})

router.get('/edit/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        const admin = await Admin.getNama(req.session.adminId)
        const aplikasi = await Aplikasi.getById(id)

        res.render('admins/aplikasi/edit', {
            admin,
            aplikasi,
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/aplikasi')
    }
})

router.post('/update/:id', authAdmin, async (req, res) => {
    try {
        const { nama_aplikasi, hak_akses } = req.body
        const {id} = req.params
        const data = { nama_aplikasi, hak_akses }

        if (!nama_aplikasi) {
            req.flash('error', 'Nama Aplikasi wajib diisi')
            req.flash('data', data)
            return res.redirect(`/admin/aplikasi/edit/${id}`)
        }

        if (!hak_akses) {
            req.flash('error', 'Hak Akses wajib diisi')
            req.flash('data', data)
            return res.redirect(`/admin/aplikasi/edit/${id}`)
        }

        if (await Aplikasi.checkNamaAplikasiUpdate(data, id)) {
            req.flash('error', 'Nama Aplikasi sudah ditambahkan sebelumnya')
            req.flash('data', data)
            return res.redirect(`/admin/aplikasi/edit/${id}`)
        }

        await Aplikasi.update(data, id)
        req.flash('success', 'Aplikasi berhasil diperbarui')
        res.redirect('/admin/aplikasi')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/aplikasi')
    }
})

router.post('/hapus/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params

        if (await Aplikasi.checkAplikasiUsed(id)) {
            req.flash('error', 'Nama Aplikasi sedang digunakan')
            return res.redirect('/admin/aplikasi')
        }

        await Aplikasi.delete(id)
        req.flash('success', 'Nama Aplikasi berhasil dihapus')
        res.redirect('/admin/aplikasi')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/aplikasi')
    }
})

module.exports = router