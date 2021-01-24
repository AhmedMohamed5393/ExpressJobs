var User = require('../../models/user');
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
        if(phone.number.length != 10 || isNaN(parseFloat(phone.number))){
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
              res.redirect('/user/verify/get');
            }
          }).catch(e => {
            errors.push({ msg: e.message });
            res.json({ errors });
          });
        }
    }
}