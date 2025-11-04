const express = require('express')

const admin = require('../../models/Admin')
const { authAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        res.render('admins/dashboard')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router