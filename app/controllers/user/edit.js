var User    = require('../../models/user'),
    bcrypt  = require('bcryptjs');
module.exports = {
    showEdition: (req, res) => {
        var errors = [];
        User.findById(req.params.id).then(user => {
            res.status(200).json({ user: user });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json(errors);
        });
    },
    UpdateUser: (req, res) =>{     
        var errors    = [],
            { phone } = req.body;
        bcrypt.genSalt(10, (e, salt) => {
            bcrypt.hash(phone, salt, (err, hash) => {
                if(err){
                    errors.push({ msg: err.message });
                }
                User.updateOne({ _id: req.params.id } , {
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                    phone: {
                        code: req.body.code,
                        number: hash
                    },
                    target: req.user.target,
                    work: req.body.work,
                    skills: req.body.skills,
                    birthdate: req.body.birthdate,
                    startdate: req.user.startdate
                }).then(updatedUser => {
                    req.flash(
                        'success_msg',
                        'The user is updated sucessfully'
                    );
                    res.status(201).json({ done: true });
                }).catch(err => {
                    req.flash('error_msg', "Sorry, Please try again later");
                    errors.push({ msg: err.message });
                    res.json({ done: false, errors });
                });
            });
        });
    },
    DeleteUser: (req, res) => {
        var errors = [];
        User.findByIdAndDelete(req.params.id).then(deletedUser => {
            req.flash('success_msg', 'This user is deleted successfully');
            res.json({ done: true });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
        });
    }
}