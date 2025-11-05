const express = require('express')
const bcrypt = require('bcryptjs')

const Pegawai = require('../models/Pegawai')
const Admin = require('../models/Admin')

const router = express.Router()

router.get('/daftar-ulang', async (req, res) => {
    try {
        res.render('auths/register-pegawai', { data: req.flash('data')[0] })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        res.redirect('/')
    }
})

router.post('/reg', async (req, res) => {
    const { nomor_pegawai, kata_sandi, konfirmasi_kata_sandi } = req.body
    const data = { nomor_pegawai, kata_sandi }

    try {
        if (!data.nomor_pegawai) {
            req.flash('error', 'Nomor pegawai tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (!data.kata_sandi) {
            req.flash('error', 'Kata sandi tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (!konfirmasi_kata_sandi) {
            req.flash('error', 'Konfirmasi kata sandi tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (await Pegawai.checkNP(data)) {
            req.flash('error', 'Nomor pegawai anda belum terdaftar oleh Admin')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        const accountAlreadyExists = await Pegawai.getAllByNP(data)
        if (accountAlreadyExists.kata_sandi && accountAlreadyExists.status_akun) {
            req.flash('error', 'Nomor pegawai anda sudah terdaftar')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (data.kata_sandi.length < 6) {
            req.flash('error', 'Kata sandi harus terdiri dari minimal 6 karakter')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (!/[A-Z]/.test(data.kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung minimal 1 huruf kapital')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (!/[a-z]/.test(data.kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung minimal 1 huruf kecil')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (!/\d/.test(data.kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung minimal 1 angka')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        if (data.kata_sandi != konfirmasi_kata_sandi) {
            req.flash('error', 'Kata sandi dan konfirmasi kata sandi tidak cocok')
            req.flash('data', data)
            return res.redirect('/daftar-ulang')
        }

        await Pegawai.register(data)
        req.flash('success', 'Registrasi berhasil, silahkan tunggu aktivasi dari admin')
        res.redirect('/daftar-ulang')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        req.flash('data', data)
        res.redirect('/')
    }
})

router.get('/masuk', async (req, res) => {
    try {
        res.render('auths/login', { data: req.flash('data')[0] })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        res.redirect('/')
    }
})

router.post('/log', async (req, res) => {
    const { nomor_admin, kata_sandi } = req.body
    const data = { nomor_admin, kata_sandi }

    try {
        if (!nomor_admin) {
            req.flash('error', 'Nomor admin tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        if (!kata_sandi) {
            req.flash('error', 'Kata sandi tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        const admin = await Admin.login(data)

        if (!admin) {
            req.flash('error', 'Nomor pegawai tidak ditemukan')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        if (!await bcrypt.compare(kata_sandi, admin.kata_sandi)) {
            req.flash('error', 'Kata sandi salah')
            req.flash('data', data)
            return res.redirect('/masuk')
        }

        req.session.adminId = admin.id

        req.flash('success', 'Login Berhasil')

        res.redirect('/admin/dashboard')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        req.flash('data', data)
        res.redirect('/')
    }
})

router.get('/logout', async(req, res) => {
    try {
        req.session.destroy()
        req.flash('success', 'Logout successful')
        res.redirect('/')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        if (req.session.adminId) return res.redirect('/admin/dashboard')
    }
})

module.exports = router