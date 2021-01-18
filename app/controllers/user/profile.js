var User = require('../../models/user');
module.exports = {
    GetUserProfile: (req , res) => {
        var errors  = [],
            message = req.flash('error');
        User.findById(req.params.id).then(userinfo => {
            res.status(200).json({
                message: message,
                user: userinfo
            });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
        });
    }
}