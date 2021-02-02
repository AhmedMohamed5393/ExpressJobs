var User   = require('../../models/user'),
    bcrypt = require('bcryptjs');
module.exports = {
    GetSignUpPage: (req, res) => {
        var message = req.flash('error');
        res.status(200).json(message);
    },
    PostSignUpPage: (req, res) => {
        const { name, phone, target } = req.body;
        let errors = [];
        if (!name || !phone || !target) {
          errors.push({ msg: 'Please enter all fields' });
        }
        if(phone.number.length != 10 || isNaN(parseInt(phone.number)) ||
           phone.code.length > 5 || isNaN(parseInt(phone.code))){
            errors.push({ msg: 'This is not a mobile phone number' });
        }
        if (errors.length > 0) {
          req.flash('error_msg', "Sorry, Please try again later");
          res.json({ done: false, errors });
        } else {
          User.findOne({
              $or: [
                { name: name },
                { phone: { code: phone.code, number: phone.number } }
              ]
          }).then(user => {
            if(user){
              errors.push({ msg: 'This user is already exists' });
              res.json(errors);
            }else{
                var newuser = new User({
                      name: name,
                      target: target,
                      phone: {
                        code: phone.code,
                        number: phone.number
                      },
                      email: null,
                      address: {
                        city: null,
                        country: null,
                      },
                      birthdate: null,
                      startdate: Date.now()
                    });
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(phone.number, salt, (err, hash) => {
                      if (err) {
                        req.flash(
                          'error_msg',
                          "Sorry, Please try again later"
                        );
                        errors.push({ msg: err.message });
                      }else{
                        newuser.phone.number = hash;
                        newuser.save().then(usercreated => {
                          
                          req.flash(
                            'success_msg',
                            'You are now registered successfully'
                          );
                          res.status(201).json({ done: true });
                        }).catch(e => {
                          req.flash(
                            'error_msg',
                            "Sorry, Please try again later"
                          );
                          errors.push({ msg: e.message });
                          res.json({ done: false, errors });
                        });
                      }
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