var Company = require('../../models/company');
module.exports = {
    createJob: async(req, res) => {
        const errors  = [],
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
        try {
            await Promise.all([ 
                Company.findByIdAndUpdate(req.params.company, {
                    $push: { jobs: job }
                })
            ]);
            req.flash('success_msg', 'Job is created successfully');
            res.status(201).json({ done: true });
        } catch (err) {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
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