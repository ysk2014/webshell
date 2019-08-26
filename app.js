var express = require('express');
var path = require('path');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.success = function(data) {
        res.json({
            code: 0,
            msg: '操作成功',
            data: data
        });
    };

    res.fail = function(message) {
        res.json({
            code: 1,
            msg: message
        });
    };
    next();
});

app.use('/api', indexRouter);

app.use('*', (req, res) => {
    res.render('index', { title: 'Express' });
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send(err);
});

module.exports = app;
