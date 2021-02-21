# ExpressJobs

To install node_modules you should install express with this command:
npm i --save express

To run this code you should type this command:
npm run start   or   node server

Use this link https://expressjobs.herokuapp.com to interact with the APIs of this app
In addition, each of the following routes should be added to the above link

Note: // "/:page" is a route we use for the page pagination
      // instead of :page we write a page number as 1,2, 3, ... and so on

// user routes

GET   / or /:page     // we use it to get the home page or the page of number ..
GET   /users/get      // we use it to fetch data of all users
GET   /user/login      // we use it to get the login page
POST  /user/signup      // we use it to create a new user
POST  /user/login      // we use it to login user
GET   /user/:id        // we use it to get the profile page of user with id = :id
GET   /user/edit   // we use it to get edit page for updating data of this user
PUT   /user/edit   // we use it to update the user's data
DELETE  /user/delete  // we use it to delete the user
GET   /user/logout     // we use it to log out the user

// company routes

GET   /companies/get   // we use it to fetch data of all companies
GET   /company/:id     // we use it to fetch data of company with id = :id
POST  /company/new     // we use it to create new company
GET   /company/:id/edit  // we use it to get the edit company page
PUT   /company/:id  // we use it to update the data of this company without
                         // touching the jobs data inside this company
DELETE /company/:id   // we use it to delete the company with all jobs and proposals

GET   /jobs/suitable   // we use it to fetch data of all jobs which are suitable
                       // for the current user according to the matching between
                       // skills of this user and the required skills for each job
POST  /job/:company     // we use it to create new job which belongs to that company
PUT   /job/:job/:company    // we use it to update the data of this job
PUT   /job/:job/:company/delete   // we use it to delete this job
POST   /proposal/:proposal/:job/:company  // we use it to create a new proposal
                                          // resulted from the submit action which
                                          // is done by the user

PUT    /proposal/:proposal/:job/:company  // we use it to delete this proposal


In this project, we have two collections which are:

1. user collection

name: String,
email: String,
address: {
    city: String,
    country: String
},
phone: String,
target: String,                 // target means the type of the user
                                // types of user are admin, company, user
work: [{                        // This attribute is called work experience
    title: String,              // It is considered as an array of objects
    company: String,
    experience: Number
}],
skills: {
    education: [{
        school: String,            // school means schools or colleges
        gov: String,               // gov means government or university
        degree: String,
        specifications: {          // some colleges has students who should
            major: String,         // specified in two fields like a student who
            minor: String          // specified in chemistry and physics
        }
    }],
    technical: [{
        name: String,              // name of technical skill
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
startdate: Date

2. company collection

        name: String,
        admin: String,   // id of admin referred to the user
        description: String,
        email: String,
        address: {
            city: String,
            country: String
        },
        website: String,
        startdate: Date,
        jobs: [{
            id: String,
            resident: Boolean,        // resident means that a job requires users
            title: String,            // who are from the same city
            description: String,
            startdate: Date,
            field: String,
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
                limit: Array   ----->  // array of required scores of each type 
            },                         // of skills for matching with the skills
                                       // of each of the users
            proposals: [{
                user: String,           // id of the current user
                submitdate: Date,       // proposal means the action when the user
                coverletter: String     // submit a specific job
            }]
        }]