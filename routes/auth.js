const express = require('express')
const bcrypt = require('bcryptjs')

const Pegawai = require('../models/Pegawai')
const Admin = require('../models/Admin')

const router = express.Router()

router.get('/daftar-pegawai', async (req, res) => {
    try {
        res.render('auths/register-pegawai', { data: req.flash('data')[0] })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        res.redirect('/')
    }
})

router.post('/reg', async (req, res) => {
    const { nama, nomor_pegawai, kata_sandi, konfirmasi_kata_sandi } = req.body
    const data = { nomor_pegawai, kata_sandi }

    try {
        if (!data.nomor_pegawai) {
            req.flash('error', 'Nomor pegawai tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (!data.kata_sandi) {
            req.flash('error', 'Kata sandi tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (!konfirmasi_kata_sandi) {
            req.flash('error', 'Konfirmasi kata sandi tidak boleh kosong')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (await Pegawai.checkNP(data)) {
            req.flash('error', 'Nomor pegawai anda belum terdaftar oleh Admin')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        const accountAlreadyExists = await Pegawai.getAllByNP(data)
        if (accountAlreadyExists.kata_sandi && accountAlreadyExists.status_akun) {
            req.flash('error', 'Nomor pegawai anda sudah terdaftar')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (data.kata_sandi.length < 6) {
            req.flash('error', 'Kata sandi harus terdiri dari minimal 6 karakter')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (!/[A-Z]/.test(data.kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung minimal 1 huruf kapital')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (!/[a-z]/.test(data.kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung minimal 1 huruf kecil')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (!/\d/.test(data.kata_sandi)) {
            req.flash('error', 'Kata sandi harus mengandung minimal 1 angka')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        if (data.kata_sandi != konfirmasi_kata_sandi) {
            req.flash('error', 'Kata sandi dan konfirmasi kata sandi tidak cocok')
            req.flash('data', data)
            return res.redirect('/daftar-pegawai')
        }

        await Pegawai.register(data)
        req.flash('success', 'Registrasi berhasil, silahkan tunggu aktivasi dari admin')
        res.redirect('/daftar-pegawai')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        req.flash('data', data)
        res.redirect('/')
    }
})

router.get('/login', async (req, res) => {
    try {
        res.render('auths/login', { data: req.flash('data')[0] })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        res.redirect('/')
    }
})

router.post('/log', async (req, res) => {
    const { email, password } = req.body
    const data = { email, password }

    try {
        if (!email) {
            req.flash('error', 'Email is required')
            req.flash('data', data)
            return res.redirect('/login')
        }

        if (!password) {
            req.flash('error', 'Password is required')
            req.flash('data', data)
            return res.redirect('/login')
        }

        let users = null
        let role = null

        users = await User.login(data)
        if (users) {
            role = 'User'
        } else {
            users = await Admin.login(data)
            if (users) {
                role = 'Admin'
            }
        }

        if (!users) {
            req.flash('error', 'Email not found')
            req.flash('data', data)
            return res.redirect('/login')
        }

        if (!await bcrypt.compare(password, users.password)) {
            req.flash('error', 'Password incorrect')
            req.flash('data', data)
            return res.redirect('/login')
        }

        if (users.status != 'Active') {
            req.flash('error', 'Account is not active')
            req.flash('data', data)
            return res.redirect('/login')
        }

        req.session.userId = users.id
        req.session.role = role

        req.flash('success', 'Login successful')

        if (req.session.role == "User") return res.redirect('/user/dashboard')
        if (req.session.role == "Admin") return res.redirect('/admin/dashboard')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        req.flash('data', data)
        res.redirect('/')
    }
})

router.get('/logout', async(req, res) => {
    try {
        const role = req.session.role

        req.flash('success', 'Logout successful')
        req.session.destroy()
        res.redirect('/')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        if (req.session.role == "Admin") return res.redirect('/admin/dashboard')
        if (req.session.role == "User") return res.redirect('/user/dashboard')
    }
})

module.exports = router