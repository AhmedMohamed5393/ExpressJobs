var Company   = require('../models/company'),
    functions = require('../middlewares/functions');
module.exports = {
    GetHomePage: (req , res) => {
        var messages    = req.flash('error'),
            successMgs  = req.flash('success')[0],
            noMatch     = null,
            resPerPage  = 10,
            page        = req.params.page || 1,
            jobs        = [],
            companies   = [];
        if(req.query.search){
            var input = new RegExp(functions.escaperegex(req.query.search), 'gi');
            try{
                Company.find({
                    $or: {
                        title: input,
                        description: input,
                        jobs: {
                            $or: {
                                title: input,
                                description: input
                            }
                        }
                    }
                }).skip((resPerPage * page) - resPerPage)
                  .limit(resPerPage)
                  .then(foundcompanies => {
                    if(!foundcompanies){
                        noMatch = "No jobs or companies match that query," +
                                  " please try again.";
                    }else{
                        companies.splice(0, companies.length);
                        jobs.splice(0, jobs.length);
                        foundcompanies.forEach(company => {
                            company.jobs.sort({ startdate: -1 });
                            companies.push(company);
                        });
                        companies.forEach(company => {
                            company.jobs.forEach(job => {
                                jobs.push(job);
                            });
                        });
                        res.status(200).json({
                            messages: messages,
                            successMgs: successMgs,
                            noMessages: !successMgs,
                            noMatch: noMatch,
                            current: page,
                            pages: Math.ceil(jobs.length / resPerPage),
                            companies: companies
                        });
                    }
                }).catch(err => {
                    req.flash('error_msg', err.msg);
                });
            }catch(error){
                req.flash('error_msg', error.msg);
            }
        }else{
            Company.find()
               .skip((resPerPage * page) - resPerPage)
               .limit(resPerPage)
               .then(foundcompanies => {
                    companies.splice(0, companies.length);
                    jobs.splice(0, jobs.length);
                    foundcompanies.forEach(company => {
                        company.jobs.sort({ startdate: -1 });
                        companies.push(company);
                    });
                    companies.forEach(company => {
                        company.jobs.forEach(job => {
                            jobs.push(job);
                        });
                    });
                    res.status(200).json({   
                        messages: messages,
                        successMgs: successMgs,
                        noMessages: !successMgs,
                        noMatch: noMatch,
                        current: page,
                        pages: Math.ceil(jobs.length / resPerPage),
                        companies: companies
                    });
            }).catch(err => {
                req.flash('error_msg', err.msg);
                res.redirect('back');
            });
        }
    }
}