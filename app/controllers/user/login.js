var passport = require('passport');
module.exports = {
    GetSignInPage: (req, res) => {
        var message = req.flash('error');
        res.status(200).json(message);
    },
    PostSignInPage: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    }
}