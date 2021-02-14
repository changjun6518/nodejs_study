var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var db = require('../lib/db');
var qs = require('querystring');
var path = require('path');
var auth = require('../lib/auth');
const shortid = require('shortid');


var db2 = require('../lib/db2');


module.exports = function(passport){
    
  router.get('/login', function (request, response) {
    // db.query(`SELECT * FROM post`, function(error, objects){
        var title = 'login';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
              `<form action="/auth/login_process" method="post">
              <p><input type="text" name="email" placeholder="email"></p>
              <p><input type="password" name="pwd" placeholder="password"></p>
              <p>
                <input type="submit" value="login">
              </p>
            </form>
          `,''
        );
        response.send(html);
      // });
  });

  router.post('/login_process',
  passport.authenticate('local', {
  failureRedirect: '/auth/login',
  }), (req,res)=>{
  req.session.save(()=>{
    res.redirect('/');
  })
  });


  router.get('/register', function (request, response) {
    // db.query(`SELECT * FROM post`, function(error, objects){
        var title = 'login';
        var list = template.list(request.list);
        var html = template.HTML(title, list,
              `<form action="/auth/register_process" method="post">
              <p><input type="text" name="email" placeholder="email" value="asd@naver.com"></p>
              <p><input type="password" name="pwd" placeholder="password" value="111"></p>
              <p><input type="password" name="pwd2" placeholder="password_confirm" value="111"></p>
              <p><input type="text" name="displayName" placeholder="display name" value="chang"></p>
              <p>
                <input type="submit" value="register">
              </p>
            </form>
          `,''
        );
        response.send(html);
      // });
  });

router.post('/register_process', function(request, response) { 
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;

    if(pwd !== pwd2){
      response.redirect("/auth/register");
    }else{
      var user = {
        id: shortid.generate(),
        email: email,
        password: pwd,
        displayName: displayName
      };
      db2.get('users').push(user).write();
      request.logIn(user,function(err){
        console.log('redirect');
        return response.redirect('/');
      })
    }
});


  router.get('/logout', function (request, response) {
  request.session.destroy(function(err){
    response.redirect('/');
  });
  });

  return router;
}

