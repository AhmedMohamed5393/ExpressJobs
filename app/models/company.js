var mongoose = require('mongoose'),
    db       = mongoose.connection,
    company  = mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            city: String,
            country: String
        },
        website: {
            type: String,
            required: false
        },
        startdate: {
            type: Date,
            required: true
        },
        jobs: [{
            id: {
                type: String,
                required: true
            },
            resident: {
                type: Boolean,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            startdate: {
                type: Date,
                required: true
            },
            field: {
                type: String,
                required: true
            },
            work: {
                title: String,
                experience: {
                    from: Number,
                    to: Number
                }
            },
            age: {
                from: Number,
                to: Number
            },
            skills: {
                education: {
                    school: String,
                    gov: String,
                    degree: String,
                    specifications: {
                        major: String,
                        minor: String
                    }
                },
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
                }],
                limit: Array
            },
            proposals: [{
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                submitdate: {
                    type: Date,
                    required: true
                },
                coverletter: String
            }]
        }]
    }),
    Company  = mongoose.model('Company' , company , 'company');
db.once('open' , () => { console.log('connection with company is succeeded') });
db.on('error' , console.error.bind(console , 'connection with company is failed'));
module.exports = Company;