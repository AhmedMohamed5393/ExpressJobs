var Company  = require('../models/company'),
    User     = require('../models/user');
module.exports = {
    checkAdminCompanyOwnership: (req, res, next) => {
        var errors = [];
        if(req.isAuthenticated()){
            if(req.user.phone == "201110095420"){
                Company.find()
                .then(companies => {
                    next();
                }).catch(err => {
                    errors.push({ msg: err.msg });
                });
            }else{
                Company.find()
                .where({ admin: req.user._id })
                .then(companies => {
                    next();
                }).catch(err => {
                    errors.push({ msg: err.msg });
                });
            }
        }
    },
    checkAdminOwnership: (req, res, next) => {
        var errors = [];
        User.find().then(users => {
            next();
        }).catch(err => {
            errors.push({ msg: err.msg });
        });
    },
    checkAllOwnership: (req, res, next) => {
        var errors = [];
        if(req.isAuthenticated()){
            if(req.user.phone == "201110095420" ||
               req.user._id == req.params.id ||
               req.user.target == "company"){
                User.findById(req.params.id).then(user => {
                    next();
                }).catch(err => {
                    errors.push({ msg: err.msg });
                });
            }
        }
    },
    checkUserOwnership: (req, res, next) => {
        var errors = [];
        if(req.isAuthenticated()){
            if(req.user._id == req.params.id){
                User.findById(req.user._id).then(user => {
                    next();
                }).catch(err => {
                    errors.push({ msg: err.msg });
                });
            }
        }
    }
}