var Company = require('../../models/company');
module.exports = {
    createCompany: (req, res) => {
        var errors = [],
            company = new Company({
                name: req.body.name,
                admin: req.user._id,
                description: req.body.description,
                email: req.body.email,
                address: req.body.address,
                website: req.body.website,
                startdate: Date.now()
            });
        if(req.user.target == "admin" || req.user.target == "company"){
            company.save().then(newcompany => {
                req.flash('success_msg', 'The company is created successfully');
                res.status(201).json({ done: true });
            }).catch(error => {
                req.flash('error_msg', "Sorry, Please try again later");
                errors.push({ msg: error.message });
                res.json({ done: false, errors });
            });
        }else{
            req.flash(
                'error_msg',
                "Sorry, You don't have the permission to update this data"
            );
            res.json({
                done: false,
                message: "You don't have the permission to update this data"
            });
        }
    }
}