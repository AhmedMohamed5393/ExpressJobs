var User = require('../../models/user');
module.exports = {
    showUsers: (req, res) => {
        User.find().then(users => {
            res.status(200).json(users);
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            res.json(err);
        });
    }
}