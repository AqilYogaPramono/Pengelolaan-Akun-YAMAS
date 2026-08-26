const express = require('express')
const bcrypt = require('bcryptjs')

const Admin = require('../../models/Admin')
const { authAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/ubah-kata-sandi', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        res.render('admins/change-password', { 
            admin,
            data: req.flash('data')[0]
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/admin/ubah-kata-sandi')
    }
})

router.post('/change-password', authAdmin, async (req, res) => {
    try {
        const { kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru } = req.body
        const data = { kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru }

        if (!kata_sandi) {
            req.flash('error', 'Kata sandi tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        if (!kata_sandi_baru) {
            req.flash('error', 'Kata sandi baru tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        if (!konfirmasi_kata_sandi_baru) {
            req.flash('error', 'Konfirmasi kata sandi baru tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        const admin = await Admin.getById(req.session.adminId)
        
        if (!(await bcrypt.compare(kata_sandi, admin.kata_sandi))) {
            req.flash('error', 'Kata sandi lama yang anda inputkan salah')
            req.flash('data', data)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        if (kata_sandi_baru.length < 6) {
            req.flash('error', 'Kata Sandi baru Minimal 6 karakter')
            req.flash('data', req.body)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        if (!/[A-Z]/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi baru Minimal 1 Huruf Kapital')
            req.flash('data', req.body)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        if (!/[a-z]/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi baru Minimal 1 Huruf Kecil')
            req.flash('data', req.body)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        if (!/\d/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi baru Minimal 1 Angka')
            req.flash('data', req.body)
            return res.redirect('/admin/ubah-kata-sandi')
        }

        if (kata_sandi_baru != konfirmasi_kata_sandi_baru) {
            req.flash('error', 'Konfirmasi kata baru dan kata sandi baru tidak sama')
            req.flash('data', req.body)
            return res.redirect('/admin/ubah-kata-sandi')
        }
        
        await Admin.changePassword(req.session.adminId, data)
        req.flash('success', 'Kata Sandi berhasil diubah')
        res.redirect('/')
    } catch (error) {
        console.error(error)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

module.exports = router