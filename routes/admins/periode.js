const express = require('express')

const Admin = require('../../models/Admin')
const Pegawai = require('../../models/Pegawai')
const Periode = require('../../models/Periode')
const { authAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const periode = await Periode.getAll()

        res.render('admins/periode/index', {admin, periode})
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.get('/buat', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const pegawai = await Pegawai.getAll()

        res.render('admins/periode/create', {
            pegawai,
            admin,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/periode')
    }
})

router.post('/create', authAdmin, async (req, res) => {
    try {
        const { id_pegawai, periode_mulai, periode_berakhir } = req.body
        const data = { id_pegawai, periode_mulai, periode_berakhir }

        if (!id_pegawai) {
            req.flash('error', 'Pegawai wajib dipilih')
            req.flash('data', data)
            return res.redirect('/admin/periode/buat')
        }

        if (!periode_mulai) {
            req.flash('error', 'Priode Mulai wajib diisi')
            req.flash('data', data)
            return res.redirect('/admin/periode/buat')
        }

        if (!periode_berakhir) {
            req.flash('error', 'Priode Berakhir wajib diisi')
            req.flash('data', data)
            return res.redirect('/admin/periode/buat')
        }

        await Periode.store(data)
        req.flash('success', 'Periode Akun berhasil dibuat')
        res.redirect('/admin/periode')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/periode')
    }
})

router.get('/edit/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        const admin = await Admin.getNama(req.session.adminId)
        const periode = await Periode.getById(id)

        res.render('admins/periode/edit', {
            admin,
            periode,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/periode')
    }
})

router.post('/update/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        const { periode_mulai, periode_berakhir } = req.body
        const data = { periode_mulai, periode_berakhir }

        if (!periode_mulai) {
            req.flash('error', 'Periode Mulai wajib diisi')
            req.flash('data', data)
            return res.redirect(`/admin/periode/edit/${id}`)
        }

        if (!periode_berakhir) {
            req.flash('error', 'Periode Berakhir wajib diisi')
            req.flash('data', data)
            return res.redirect(`/admin/periode/edit/${id}`)
        }

        await Periode.update(data, id)
        req.flash('success', 'Periode Akun berhasil diperbarui')
        res.redirect('/admin/periode')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/periode')
    }
})

router.post('/hapus/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params

        await Periode.delete(id)
        req.flash('success', 'Periode Akun berhasil dihapus')
        res.redirect('/admin/periode')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/periode')
    }
})

module.exports = router