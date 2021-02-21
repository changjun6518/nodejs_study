var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var db = require('../lib/db');
var qs = require('querystring');
var path = require('path');
var auth = require('../lib/auth');
const shortid = require('shortid');

const { User } = require('../models');



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

        console.log("request.user", request.user);
        User.findOne({
          where: {email: request.user.email}
        }).then(user=>{
          var html = template.HTML(title, list,
            `<form action="/auth/register_process" method="post">
            <p><input type="text" name="name" placeholder="name" value=${user.name}></p>
            <p><input type="text" name="email" placeholder="email" value=${user.email}></p>
            <p><input type="password" name="pwd" placeholder="password" value="111"></p>
            <p><input type="password" name="pwd2" placeholder="password_confirm" value="111"></p>
            <p><input type="text" name="displayName" placeholder="display name" value=${user.displayName}></p>
            <p>
              <input type="submit" value="register">
            </p>
          </form>
        `,''
      );
      response.send(html);
        })
      // });
  });

router.post('/register_process', function(request, response) { 
    var post = request.body;
    var name = post.name;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;

    if(pwd !== pwd2){
      response.redirect("/auth/register");
    }else{
      // 비번 일치할때 유저가 있는지 확인
    User
    .findOrCreate({where: {name: name }, 
      defaults: {email: email, 
                password: pwd,
                displayName: displayName}})
                .then( result => {
                  console.log("데이터 추가 완료");
                  res.redirect("/");
                })
                .catch( err => {
                  console.log("데이터 추가 실패");
                })
    }

    // request.logIn(User,function(err){
    //   console.log('redirect');
    //   return response.redirect('/');
    // })
});



  router.get('/logout', function (request, response) {
  request.session.destroy(function(err){
    response.redirect('/');
  });
  });

  return router;
}

