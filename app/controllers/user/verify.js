require('dotenv').config({ path: '.env' });
var bcrypt     = require('bcryptjs'),
    User       = require('../../models/user'),
    accountSid = process.env.TWILIO_ACCOUNT_SID,
    authToken  = process.env.TWILIO_AUTH_TOKEN,
    client     = require('twilio')(accountSid, authToken);
module.exports = {
    getVerifyPage: (req, res) => {
        var message = req.flash('error');
        res.status.json(message);
    },
    verifyUser: (req, res) => {
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
            }),
            phonestr = phone.code + phone.number.toString();
        client.verify.services.create({
            friendlyName: "Your Express account"
        }).then(service => {
          client.verify.services(service.sid)
            .verifications.create({
                to: phonestr,
                channel: 'sms'
            }).then(verification => {
                  client.verify.services(service.sid)
                    .verificationChecks
                    .create({
                         to: verification.to,
                         code: verifycode
                    }).then(verification_check => {
                        if(verification_check.status == "pending"){
                          req.flash("error_msg", "Invalid code");
                          res.json({ done: false });
                        }else{
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
                                  User.find()
                                    .where({ target: "admin" })
                                    .then(admin => {
                                      var adminno = admin.phone.code +
                                                    admin.phone.number.toString;
                                      newuser.save().then(usercreated => {
                                        client.messages.create({
                                           body: 'Thank you for creating and ' + 
                                                 'verifying your account',
                                           from: adminno,
                                           to: phonestr
                                         }).then(message => console.log(message.sid));
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
                                  }).catch(exception => {
                                    errors.push({ msg: exception.message });
                                    res.json({ done: false, errors });
                                  });
                                }
                            });
                          });
                        }
                    });
            });
        });
    }
}