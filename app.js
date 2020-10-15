(function () {
    "use strict";
    const createError = require('http-errors');
    const express = require('express');
    const path = require('path');
    const cookieParser = require('cookie-parser');
    const expHbs = require('express-handlebars');
    const db = require("./models");
    const config = require(__dirname + '/./config/config.json');


    const app = express();
    
    /**
     * 
     * View engine setup
     * 
     */
    app.engine('.hbs', expHbs({
        extname: '.hbs'
    }));
    app.set('view engine', '.hbs');
    app.set('views', path.join(__dirname, 'views'));
    // end view engine setup

    /**
     * 
     * express configs
     * 
     */
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    // end express configs


    /**
     * 
     * routing
     * 
     */
    const indexRouter = require('./routes/index');
    app.use('/', indexRouter);

    const adminRouter = require('./routes/admin');
    app.use('/admin', adminRouter);

    const apiRouter = require('./routes/api');
    app.use('/api', apiRouter);
    // end routing



    /**
     * 
     * handle error reporting for frontend
     * 
     */
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
    // end error handlings


    // sync mysql database
    db.sequelize.sync();

    // export the app variable for further use
    module.exports = app;
})();