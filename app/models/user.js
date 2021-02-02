var mongoose              = require('mongoose'),
    db                    = mongoose.connection,
    passportLocalMongoose = require('passport-local-mongoose');
    user                  = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: false
        },
        address: {
            city: String,
            country: String
        },
        phone: {
            code: {
                type: Number,
                required: true,
                unique: false
            },
            number: {
                type: Number,
                required: true,
                unique: true
            }
        },
        target: {
            type: String,
            required: true
        },
        work: [{
            title: String,
            company: String,
            experience: Number
        }],
        skills: {
            education: [{
                school: String,
                gov: String,
                degree: String,
                specifications: {
                    major: String,
                    minor: String
                }
            }],
            technical: [{
                name: String,
                experience: Number
            }],
            language: [{
                name: String,
                fluency: Number
            }],
            soft: [{
                name: String,
                experience: Number
            }]
        },
        birthdate: Date,
        startdate: {
            type: Date,
            required: true
        }
    }),
    User                  = mongoose.model('User' , user , 'user');
    user.plugin(passportLocalMongoose);
db.once('open' , () => { console.log('connection with user is succeeded') });
db.on('error' , console.error.bind(console , 'connection with user is failed'));
module.exports = User;