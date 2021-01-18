var Company = require('../../models/company');
module.exports = {
    showCompany: (req, res) => {
        Company.findById(req.params.id).then(company => {
            res.status(200).json(company);
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            res.json(err);
        });
    },
    getCompanies: (req, res) => {
        Company.find().then(companies => {
            res.status(200).json(companies);
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            res.json(err);
        });
    }
}