const authAdmin = async (req, res, next) => {
    try {
        const role = req.session.role
        if(role == "Admin") {
            return next()
        } else {
            req.flash('error', 'Anda tidak memiliki akses ke halaman tersebut')
            res.redirect('/login')
        }
    } catch(err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/login')
    }
}

module.exports = { authAdmin }