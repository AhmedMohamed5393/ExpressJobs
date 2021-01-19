module.exports = {
    isLoggedIn: (req , res , next) => {
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/user/login');
        }
    },
    notLoggedIn: (req , res , next) => {
        if(!req.isAuthenticated()){
            return next();
        }else{
            res.json({
                message: 'Please log out first'
            });
        }
    },
    logout: (req , res , next) => {
        req.logout();
        res.redirect('/');
    },
    checkNotLogged: (req , res , next) => {
        next();
    }
}