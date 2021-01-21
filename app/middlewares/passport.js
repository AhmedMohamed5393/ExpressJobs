var User          = require('../models/user'),
    bcrypt        = require('bcryptjs'),
    localStrategy = require('passport-local').Strategy;
module.exports = (passport) => {
    passport.use('local', new localStrategy({
        usernameField: 'name',
        passwordField: 'phone',
        passReqToCallback : true
    }, (req, name, phone, done) => {
        User.findOne({
            name: name
        }).then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'This user is not registered'
                });
            }else{
                bcrypt.compare(phone, user.phone, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        req.flash('success_msg', 'You signed in successfully');
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Phone number is incorrect'
                        });
                    }
                });
            }
        }).catch(err => {
            return done(err);
        });
    }));
    passport.serializeUser((user , done) => {
        done(null , user.id);
    });
    passport.deserializeUser((id , done) => {
        User.findById(id , (err , user) => {
            done(err , user);
        });
    });
}