var Company   = require('../../models/company'),
    User      = require('../../models/user'),
    functions = require('../../middlewares/functions');
module.exports = {
    suitableJobs: (req, res) => {
        var errors  = [],
            workarr = [],
            eduarr  = [],
            techarr = [],
            langarr = [],
            softarr = [],
            percent = [],
            ismatch = [],
            myjobs  = [];
        User.findById(req.user._id).then(user => {
            myjobs.splice(0, myjobs.length);
            Company.find().then(foundcompanies => {
                foundcompanies.forEach(company => {
                    company.jobs.forEach(job => {
                        workarr.splice(0, workarr.length);
                        eduarr.splice(0, eduarr.length);
                        techarr.splice(0, techarr.length);
                        langarr.splice(0, langarr.length);
                        softarr.splice(0, softarr.length);
                        ismatch.splice(0, ismatch.length);
                        percent.splice(0, percent.length);
                        if((job.resident == false || (job.resident == true &&
                            user.address.city == company.address.city &&
                            user.address.country == company.address.country))){
                            user.work.forEach(work => {
                                if(work.title == job.work.title){
                                    if(work.experience >= job.work.experience.from ||
                                       work.experience <= job.work.experience.to){
                                        if(!workarr.includes(work)){
                                            workarr.push(work);
                                        }
                                    }
                                }
                            });
                            var wper = workarr.length * 100 / job.work.length;
                            percent.push(wper);
                            user.skills.education.forEach(education => {
                                if(education.specifications.major
                                    == job.skills.specifications.major ||
                                   education.specifications.major
                                    == job.skills.specifications.minor){
                                  if(education.degree == job.skills.education.degree)
                                  {
                                      if(!eduarr.includes(education)){
                                          eduarr.push(education);
                                      }
                                  }
                                }
                                if(education.specifications.minor
                                    == job.skills.specifications.major ||
                                   education.skills.specifications.minor
                                    == job.skills.specifications.minor){
                                    if(education.degree == job.skills.
                                         education.degree){
                                        if(!eduarr.includes(education)){
                                            eduarr.push(education);
                                        }
                                    }
                                }
                            });
                            var eper = eduarr.length * 100 / job.skills
                                                                .education.length;
                            percent.push(eper);
                            user.skills.technical.forEach(utechnical => {
                                job.skills.technical.forEach(jtechnical => {
                                    if(utechnical.name == jtechnical.name){
                                        if(utechnical.experience >=
                                            jtechnical.experience){
                                            if(!techarr.includes(utechnical)){
                                                techarr.push(utechnical);
                                            }
                                        }
                                    }
                                });
                            });
                            var tper = techarr.length * 100 /
                                       job.skills.technical.length;
                            percent.push(tper);
                            user.skills.language.forEach(ulanguage => {
                                job.skills.language.forEach(jlanguage => {
                                    if(ulanguage.name == jlanguage.name){
                                        if(ulanguage.fluency >= jlanguage.fluency){
                                            if(!langarr.includes(ulanguage)){
                                                langarr.push(ulanguage);
                                            }
                                        }
                                    }
                                });
                            });
                            var lper = langarr.length * 100 / job.skills
                                                                 .language.length;
                            percent.push(lper);
                            user.skills.soft.forEach(usoft => {
                                job.skills.soft.forEach(jsoft => {
                                    if(usoft.name == jsoft.name){
                                        if(usoft.experience <= 
                                            jsoft.experience){
                                            if(!softarr.includes(usoft)){
                                                softarr.push(usoft);
                                            }
                                        }
                                    }
                                });
                            });    
                            var sper = softarr.length * 100 / job.skills.soft.length,
                                i    = 0;
                            percent.push(sper);
                            if(percent.length == job.skills.limit.length){
                                percent.forEach(element => {
                                    if(element >= job.skills.limit[i]){
                                        ismatch.push(element);
                                    }
                                    i++;
                                });
                            }
                            if((ismatch.length == percent.length) &&
                               (job.age.from == null || job.age.to == null ||
                               (job.age.from <= functions.getAge(user.birthdate) &&
                                job.age.to >= functions.getAge(user.birthdate)))){
                                myjobs.push(job);
                            }
                        }
                    });
                });
                res.status(200).json(myjobs);
            }).catch(error => {
                req.flash('error_msg', "Sorry, Please try again later");
                errors.push({ msg: error.message });
            });
        }).catch(err => {
            req.flash('error_msg', "Sorry, Please try again later");
            errors.push({ msg: err.message });
            res.json({ errors });
        });
    }
}