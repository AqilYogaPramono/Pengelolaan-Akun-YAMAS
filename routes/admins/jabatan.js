const express = require('express')

const Admin = require('../../models/Admin')
const Jabatan = require('../../models/jabatan')
const { authAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const jabatan = await Jabatan.getAll()

        res.render('admins/jabatan/index', {admin, jabatan})
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.get('/buat', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)

        res.render('admins/jabatan/create', {
            admin,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.post('/create', authAdmin, async (req, res) => {
    try {
        const { nama_jabatan } = req.body
        const data = { nama_jabatan }

        if (!nama_jabatan) {
            req.flash('error', 'Nama jabatan wajib diisi')
            req.flash('data', data)
            return res.redirect('/admin/jabatan/buat')
        }

        if (await Jabatan.checkNamaJabatanStore(data)) {
            req.flash('error', 'Nama jabatan sudah ditambahkan sebelumnya')
            req.flash('data', data)
            return res.redirect('/admin/jabatan/buat')
        }

        await Jabatan.store(data)
        req.flash('success', 'Jabatan berhasil dibuat')
        res.redirect('/admin/jabatan')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.get('/edit/:id', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const jabatan = await Jabatan.getById(req.params.id)

        res.render('admins/jabatan/edit', {
            admin,
            jabatan,
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.post('/update/:id', authAdmin, async (req, res) => {
    try {
        const { nama_jabatan } = req.body
        const id = req.params.id
        const data = { nama_jabatan }

        if (!nama_jabatan) {
            req.flash('error', 'Nama jabatan wajib diisi')
            req.flash('data', data)
            return res.redirect(`/admin/jabatan/edit/${id}`)
        }

        if (await Jabatan.checkNamaJabatanUpdate(data, id)) {
            req.flash('error', 'Nama jabatan sudah ditambahkan sebelumnya')
            req.flash('data', data)
            return res.redirect(`/admin/jabatan/edit/${id}`)
        }

        await Jabatan.update(id, data)
        req.flash('success', 'Jabatan berhasil diperbarui')
        res.redirect('/admin/jabatan')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.post('/hapus/:id', authAdmin, async (req, res) => {
    try {
        const id = req.params.id

        if (await Jabatan.checkJabatanUsed(id)) {
            req.flash('error', 'Jabatan sedang digunakan')
            return res.redirect('/admin/jabatan')
        }

        await Jabatan.delete(id)
        req.flash('success', 'Jabatan berhasil dihapus')
        res.redirect('/admin/jabatan')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

module.exports = router