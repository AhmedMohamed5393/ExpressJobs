var express            = require('express'),
    router             = express.Router(),
    bodyParser         = require('body-parser'),
    parseUrlencoded    = bodyParser.urlencoded({ extended: true }),
    methodOverride     = require('method-override'),
    authentication     = require('./middlewares/authentication'),
    authorization      = require('./middlewares/authorization'),
    signupcontroller   = require('./controllers/user/signup'),
    signincontroller   = require('./controllers/user/login'),
    profilecontroller  = require('./controllers/user/profile'),
    editusercontroller = require('./controllers/user/edit'),
    getusercontroller  = require('./controllers/user/get'),
    getjobscontroller  = require('./controllers/job/show'),
    cjobcontroller     = require('./controllers/job/create'),
    ujobcontroller     = require('./controllers/job/update'),
    getcompcontroller  = require('./controllers/company/show'),
    ccompanycontroller = require('./controllers/company/create'),
    ucompanycontroller = require('./controllers/company/update'),
    maincontroller     = require('./controllers/main');
router.use(methodOverride('_method'));
router.get('/', parseUrlencoded, maincontroller.GetHomePage);
router.get('/:page', parseUrlencoded, maincontroller.GetHomePage);
router.get('/users/get', parseUrlencoded, authentication.isLoggedIn,
                                          getusercontroller.showUsers);
router.get('/user/login', parseUrlencoded, authentication.notLoggedIn,
                                           signincontroller.GetSignInPage);
router.post('/user/signup', parseUrlencoded, authentication.notLoggedIn,
                                             signupcontroller.PostSignUpPage);
router.post('/user/login', parseUrlencoded, authentication.notLoggedIn,
                                            signincontroller.PostSignInPage);
router.get('/user/:id', parseUrlencoded, authentication.isLoggedIn,
                                         profilecontroller.GetUserProfile);
router.get('/user/:id/edit', parseUrlencoded, authentication.isLoggedIn,
                                              authorization.checkUserOwnership,
                                              editusercontroller.showEdition);
router.put('/user/:id/edit', parseUrlencoded, authentication.isLoggedIn,
                                          authorization.checkUserOwnership,
                                          editusercontroller.UpdateUser);
router.delete('/user/:id/delete', parseUrlencoded, editusercontroller.DeleteUser);
router.get('/user/:id/logout', parseUrlencoded, authentication.isLoggedIn,
                                            authentication.logout);
router.get('/companies/get', parseUrlencoded, getcompcontroller.getCompanies);
router.get('/company/:id', parseUrlencoded, getcompcontroller.showCompany);
router.post('/company/new', parseUrlencoded, authentication.isLoggedIn,
                                             authorization.checkAdminOwnership,
                                             ccompanycontroller.createCompany);
router.get('/company/:id/edit', parseUrlencoded,
                                authentication.isLoggedIn,
                                authorization.checkAdminCompanyOwnership,
                                ucompanycontroller.showEdition);
router.put('/company/:id', parseUrlencoded, authentication.isLoggedIn,
                                            authorization.checkAdminCompanyOwnership,
                                            ucompanycontroller.updateCompany);
router.delete('/company/:id', parseUrlencoded,
                              authentication.isLoggedIn,
                              authorization.checkAdminCompanyOwnership,
                              ucompanycontroller.deleteCompany);
router.get('/jobs/suitable', parseUrlencoded, authentication.isLoggedIn,
                                              getjobscontroller.suitableJobs);
router.post('/job/:company', parseUrlencoded,
                             authentication.isLoggedIn,
                             authorization.checkAdminCompanyOwnership,
                             cjobcontroller.createJob);
router.put('/job/:job/:company', parseUrlencoded,
                                 authentication.isLoggedIn,
                                 authorization.checkAdminCompanyOwnership,
                                 ujobcontroller.updateJob);
router.put('/job/:job/:company/delete', parseUrlencoded,
                                        authentication.isLoggedIn,
                                        authorization.checkAdminCompanyOwnership,
                                        ujobcontroller.deleteJob);
router.post('/proposal/:job/:company', parseUrlencoded,
                                       authentication.isLoggedIn,
                                       cjobcontroller.submitJob);
router.put('/proposal/:proposal/:job/:company/delete',
            parseUrlencoded,
            authentication.isLoggedIn,
            authorization.checkAdminCompanyOwnership,
            ujobcontroller.deleteProposal);
module.exports = router;                                                     