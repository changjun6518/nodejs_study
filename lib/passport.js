
var db2 = require('../lib/db2');
var shortid = require('shortid');
const { User } = require('../models');

module.exports = function(app){
    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy,
    NaverStrategy = require('passport-naver').Strategy,
    GoogleStrategy = require('passport-google-oauth20').Strategy;

    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
      console.log("ser", user.id);
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findOne({ where: { id: id }})
      .then(user => {
        console.log("des", id, user);
        done(null, user);
      });
    });
    
    passport.use(new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'pwd'
      },
      function(email, password, done) {
        User.findOne({ where: { email: email, password:password }})
        .then(user => {
          if (user) {
            console.log("login 되었습니다!");
            return done(null, user);
          }else{
            return done(null, false, {
              message : 'Incorrect password.'
            });
          }
        });
      }
  ));

  // naver login
  var naverCredentials = require('../config/naver.json');
  // console.log(googleCredentials);
  passport.use(new NaverStrategy({
    clientID: naverCredentials.web.client_id,
    clientSecret: naverCredentials.web.client_secret,
    callbackURL: naverCredentials.web.redirect_uris[0]
},
function(accessToken, refreshToken, profile, done) {
  var email = profile.emails[0].value;

  console.log("profile", email);
  User.findOne({
    where: {
      email: email
    }
  }).then(user=>{
    if(user){
      // 수정해야함~!
      done(null, user);
    }else{
      var name = profile.displayName;
      var displayName = profile._json.nickname;
      if(!profile.displayName){
        name = "최창준"
      }
      if(!profile._json.nickname){
        displayName = "창준!"
      }
      User.create({
        name: name,
        password: "",
        email: email,
        displayName: displayName,
      }).then(user => {
      console.log("Data is created!")
      done(null, user);
      });
    }
  })



  // var email = profile.emails[0].value;
  //   var user = db2.get('users').find({email: email}).value();
  //   if(user){
  //     user.naverId = profile.id;
  //     db2.get('users').find({id:user.id}).assign(user).write();
  //   }else{

  //     user = {
  //       id:shortid.generate(),
  //       email: email,
  //       displayName : profile.displayName,
  //       naverId: profile.id
  //     }
  //     db2.get('users').push(user).write();
  //   }
  //   user.naverId = profile.id;
  //   db2.get('users').find({id:user.id}).assign(user).write();
    // done(null, user);
  }
));

app.get('/auth/naver',passport.authenticate('naver',null),function(req, res) {
	console.log("/main/naver");
});
  

app.get('/auth/naver/callback', 
passport.authenticate('naver', { 
  failureRedirect: '/auth/login' }),
function(req, res) {
  res.redirect('/');
});










  // google
  
  var googleCredentials = require('../config/google.json');
  // console.log(googleCredentials);

  passport.use(new GoogleStrategy({
    clientID: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    callbackURL: googleCredentials.web.redirect_uris[0]
  },
  function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value;
    var user = db2.get('users').find({email: email}).value();
    if(user){
      user.googleId = profile.id;
      db2.get('users').find({id:user.id}).assign(user).write();
    }else{

      user = {
        id:shortid.generate(),
        email: email,
        displayName : profile.displayName,
        googleId: profile.id
      }
      db2.get('users').push(user).write();
    }
    user.googleId = profile.id;
    db2.get('users').find({id:user.id}).assign(user).write();
    done(null, user);
  }
));
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email'] }));

app.get('/auth/google/callback', 
passport.authenticate('google', { 
  failureRedirect: '/auth/login' }),
function(req, res) {
  res.redirect('/');
});
  return passport;
}

