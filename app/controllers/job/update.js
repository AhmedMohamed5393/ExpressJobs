var Company = require('../../models/company');
module.exports = {
    showEdition: (req, res) => {
        var message = req.flash('error');
            errors  = [],
            editJob = [];
        Company.findById(req.params.company).then(editCompany => {
            editCompany.jobs.forEach(job => {
                if(job.id == req.params.job){
                    editJob.push(job);
                }
            });
            res.status(200).json({
                message: message,
                job: editJob
            });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.msg });
            res.json({ errors });
        });
    },
    updateJob: (req, res) => {
        var errors = [],
            {
                description
            }      = req.body;
        Company.updateOne({
            _id: req.params.company,
            jobs: { $elemMatch: { id: req.params.job } }
        }, {
            $set: {
                "jobs.$.id": req.body.id,
                "jobs.$.title": req.body.title,
                "jobs.$.description": description,
                "jobs.$.resident": req.body.resident,
                "jobs.$.field": req.body.field,
                "jobs.$.work": req.body.work,
                "jobs.$.skills": req.body.skills,
                "jobs.$.id": req.body.id
            }
        }).then(updatedjob => {
            req.flash('success_msg', 'The job is updated successfully');
            res.json({ done: true });
        }).catch(err => {
            req.flash('error_msg', "Updating failed");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
        });
    },
    deleteJob: (req, res) => {
        var errors = [];
        Company.update({ _id: req.params.company },{
            "$pull": { "jobs": { "id": req.params.job }}
        }).then(deletedjob => {
            req.flash('success_msg', 'The job is deleted successfully');
            res.json({ done: true });
        }).catch(err => {
            req.flash('error_msg', "deleting failed");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
        });
    },
    deleteProposal: (req, res) => {
        var errors = [];
        Company.findByIdAndUpdate(req.params.company).then(company => {
            company.jobs.forEach(job => {
                if(job.id == req.params.job){
                    job.proposals.forEach(proposal => {
                        if(proposal._id == req.params.proposal){
                            job.proposals.splice(proposal, 1);
                        }
                    });
                }
            });
            company.save().then(updatedcompany => {
                req.flash('success_msg', "Submition is removed");
                res.json({ done: true });
            }).catch(error => {
                req.flash('error_msg', "Deleting failed");
                errors.push({ msg: error.message });
            });
        }).catch(err => {
            req.flash('error_msg', "Updating failed");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
        });
    }
}