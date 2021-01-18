var Company = require('../../models/company');
module.exports = {
    showEdition: (req, res) => {
        var errors  = [],
            message = req.flash('error');
        Company.findById(req.params.id).then(editCompany => {
            res.status(200).json({
                message: message,
                comapny: editCompany
            });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json({ errors });
        });
    },
    updateCompany: (req, res) => {
        var errors = [];
        Company.findByIdAndUpdate(req.params.id , req.body).then(updatedcompany => {
            req.flash('success_msg', 'The company is updated successfully');
            res.json({ done: true });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
        });
    },
    deleteCompany: (req, res) => {
        var errors = [];
        Company.findByIdAndDelete(req.params.id).then(deletedcompany => {
            req.flash('success_msg', 'The company is deleted successfully');
            res.json({ done: true });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json({ done: false, errors });
        });
    }
}