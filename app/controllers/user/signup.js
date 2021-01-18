var bcrypt    = require('bcryptjs'),
    User      = require('../../models/user'),
    functions = require('../../middlewares/functions');
module.exports = {
    GetSignUpPage: (req, res) => {
        var message = req.flash('error');
        res.status(200).json({
            message: message
        });
    },
    PostSignUpPage: (req, res) => {
        const { name, phone, target } = req.body;
        let errors = [];
        if (!name || !phone || !target) {
          errors.push({ msg: 'Please enter all fields' });
        }
        if(phone.length != 12 || isNaN(parseFloat(phone))){
          errors.push({ msg: 'This is not a mobile phone number' });
        }
        if (errors.length > 0) {
          req.flash('error_msg', "Sorry, Please try again later");
          res.json({ done: false, errors });
        } else {
          var newuser = new User({
                  name: name,
                  target: target,
                  phone: phone,
                  email: null,
                  address: {
                    city: null,
                    country: null,
                  },
                  birthdate: null,
                  startdate: Date.now()
              });
          User.findOne({ name: name }).then(user => {
            if(user){
              errors.push({ msg: 'This user is already exists' });
              res.json({ errors });
            }else{
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(phone, salt, (err, hash) => {
                  if (err) {
                    req.flash('error_msg', "Sorry, Please try again later");
                    errors.push({ msg: err.message });
                  }
                  newuser.phone = hash;
                  newuser.save().then(usercreated => {
                    req.flash('success_msg', 'You are now registered successfully');
                    res.status(201).json({ done: true });
                  }).catch(e => {
                    req.flash('error_msg', "Sorry, Please try again later");
                    errors.push({ msg: e.message });
                    res.json({ done: false, errors });
                  });
                });
              });
            }
          }).catch(e => {
            errors.push({ msg: e.message });
            res.json({ errors });
          });
        }
    }
}