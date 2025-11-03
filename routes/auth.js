const express = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Admin = require('../models/Admin')

const router = express.Router()

router.get('/register', async (req, res) => {
    try {
        res.render('auths/register', { data: req.flash('data')[0] })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        res.redirect('/')
    }
})

router.post('/reg', async (req, res) => {
    const { email, password, confirmation_password } = req.body
    const data = { email, password, confirmation_password }

    try {
        if (!email) {
            req.flash('error', 'Email is required')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (!password) {
            req.flash('error', 'Password is required')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (!confirmation_password) {
            req.flash('error', 'Comfirmation password is required')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (await User.checkEmail(data)) {
            req.flash('error', 'Email already exists')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters long')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (!/[A-Z]/.test(password)) {
            req.flash('error', 'Password must contain at least 1 uppercase letter')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (!/[a-z]/.test(password)) {
            req.flash('error', 'Password must contain at least 1 lowercase letter')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (!/\d/.test(password)) {
            req.flash('error', 'Password must contain at least 1 digit')
            req.flash('data', data)
            return res.redirect('/register')
        }

        if (password != confirmation_password) {
            req.flash('error', 'Password and confirmation password do not match')
            req.flash('data', data)
            return res.redirect('/register')
        }

        await User.register(data)
        req.flash('success', 'Registration successful')
        res.redirect('/login')
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