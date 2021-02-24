var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var sequelize = require('./models').sequelize;

sequelize.sync();

const { Product } = require('./models');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))



var passport = require('./lib/passport')(app);

app.get('*', function(request, response, next){
  Product.findAll({}).then(pro=>{
    request.list = pro;
    next();
  })
});

var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');
var authRouter = require('./routes/auth')(passport);
const db = require('./lib/db');
const db2 = require('./lib/db2');

app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

