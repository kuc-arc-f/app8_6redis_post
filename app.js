var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//
var indexRouter = require('./routes/index');
var listTasksRouter = require('./routes/list_tasks');
var sortedTasksRouter = require('./routes/sorted_tasks');
var booksRouter = require('./routes/books');
//api
var apiLsitTaskRouter = require('./routes/api_list_tasks');
var apiSortedTasksTaskRouter = require('./routes/api_sorted_tasks');
var apiBooksTaskRouter = require('./routes/api_books');

var app = express();
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
// bodyParser
app.use(express.urlencoded({ limit:'5mb' ,extended: false }));
app.use(express.json({ limit: '5mb', extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
//  req.db = db;
  next();
});

app.use('/', indexRouter);
app.use('/list_tasks', listTasksRouter );
app.use('/sorted_tasks', sortedTasksRouter );
app.use('/books', booksRouter );

//api
app.use('/api_list_tasks', apiLsitTaskRouter );
app.use('/api_sorted_tasks', apiSortedTasksTaskRouter );
app.use('/api_books', apiBooksTaskRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
