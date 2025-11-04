const express = require('express')

const Admin = require('../../models/Admin')
const Pegawai = require('../../models/Pegawai')
const { authAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const pustakawanProses = await Pegawai.countPegawaiProses()
        const pustakawanAktif = await Pegawai.countPegawaiAktif()
        const pustakawanNotReRegistered = await Pegawai.countPegawaiNotRegistered()

        res.render('admins/dashboard', {admin, pustakawanProses, pustakawanAktif, pustakawanNotReRegistered})
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
})

module.exports = router