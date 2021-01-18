var express      = require('express'),
    mongoose     = require('mongoose'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport     = require('passport'),
    mongoose     = require('mongoose'),
    flash        = require('connect-flash'),
    session      = require('express-session'),
    mongostore   = require('connect-mongo')(session),
    routes       = require('./app/routes'),
    host         = process.env.ip || 'localhost',
    port         = process.env.port || 3000,
    app          = express();
require('dotenv').config({ path: '.env' });
require('./app/middlewares/passport')(passport);
mongoose.connect(process.env.MONGO_URI , { 
    useUnifiedTopology : true, 
    useNewUrlParser: true, 
    useFindAndModify: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(session({
    secret: 'expressjobs',
    resave: false,
    saveUninitialized: false,
    store: new mongostore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req , res , next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.login = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.session = req.session;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.use(routes);
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
});
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
}
app.listen(port , host , (err) => {
    if(err) throw err;
    console.log(`The server is connected to http://${ host }:${ port }`);
});
module.exports = app;