const authAdmin = async (req, res, next) => {
    try {
        if(req.session.adminId) {
            return next()
        } else {
            req.flash('error', 'Anda tidak memiliki akses ke halaman tersebut')
            res.redirect('/')
        }
    } catch(err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/')
    }
}

module.exports = { authAdmin }