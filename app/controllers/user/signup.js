var User   = require('../../models/user'),
    bcrypt = require('bcryptjs');
module.exports = {
    GetSignUpPage: (req, res) => {
        var message = req.flash('error');
        res.status(200).json(message);
    },
    PostSignUpPage: (req, res) => {
        let { name, target, number, code } = req.body,
            compnum = code.toString() + number.toString(),
            errors = [];
        if (!name || !number || !code || !target) {
          errors.push({ msg: 'Please enter all fields' });
        }
        if(number.toString().length != 10 || isNaN(number) ||
           code.toString().length > 5 || isNaN(code)){
            errors.push({ msg: 'This is not a mobile phone number' });
        }
        if (errors.length > 0) {
          req.flash('error_msg', "Sorry, Please try again later");
          res.json({ done: false, errors });
        } else {
          User.findOne({
              $or: [
                { name: name },
                { phone: compnum }
              ]
          }).then(user => {
            if(user){
              errors.push({ msg: 'This user is already exists' });
              res.json(errors);
            }else{
                var newuser = new User({
                      name: name,
                      target: target,
                      phone: compnum,
                      startdate: Date.now()
                    });
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(compnum, salt, (err, hash) => {
                      if (err) {
                        req.flash(
                          'error_msg',
                          "Sorry, Please try again later"
                        );
                        errors.push({ msg: err.message });
                      }else{
                        newuser.phone = hash;
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