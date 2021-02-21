var Company = require('../../models/company');
module.exports = {
    createJob: async(req, res) => {
        var errors  = [],
            access  = false,
            job     = {
                id: req.body.id,
                resident: req.body.resident,
                title: req.body.title,
                description: req.body.description,
                field: req.body.field,
                work: req.body.work,
                skills: req.body.skills,
                startdate: Date.now()
            };
        
        if((req.user.target == "company" || req.user.target == "admin")){
            Company.findById(req.params.company).then(company => {
                if(req.user._id == company.admin){
                    access = true;
                }
            }).catch(errException => {
                req.flash('error_msg', "Sorry, Please try again later");
                errors.push({ msg: errException.message });
                res.json({ done: false, errors });
            });
            try {
                if(access){
                    await Promise.all([ 
                        Company.findByIdAndUpdate(req.params.company, {
                            $push: { jobs: job }
                        })
                    ]);
                    req.flash('success_msg', 'Job is created successfully');
                    res.status(201).json({ done: true });
                }else{
                    req.flash('error_msg', "Sorry, Please try again later");
                    res.json({
                        done: false,
                        message: "Sorry, Permission is denied"
                    });
                }
            } catch (err) {
                req.flash('error_msg', "Sorry, Please try again later");
                errors.push({ msg: err.message });
                res.json({ done: false, errors });
            }
        }
    },
    submitJob: (req, res) => {
        var errors   = [],
            proposal = {
                user: req.user._id,
                submitdate: Date.now(),
                coverletter: req.body.coverletter
            };
        Company.findByIdAndUpdate(req.params.company).then(company => {
            company.jobs.forEach(job => {
                if(job.id == req.params.job){
                    job.proposals.push(proposal);
                }
            });
            company.save().then(updatedcompany => {
                req.flash('success_msg', 'Job is submitted successfully');
                res.json({ done: true });
            }).catch(error => {
                req.flash('error_msg', "Sorry, Please try again later");
                errors.push({ msg: error.message });
            });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
        });
    }
}