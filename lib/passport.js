
var db2 = require('../lib/db2');

module.exports = function(app){
    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
      console.log("ser", user);
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      var user = db2.get('users').find({id:id}).value();
      console.log("des", id, user);
      done(null, user);
    });
    
    passport.use(new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'pwd'
      },
      function(email, password, done) {
        var user = db2.get('users').find({email:email, password:password}).value();
        if(user){
          return done(null, user);
        }else{
          return done(null, false, {
            message : 'Incorrect password.'
          });
        }
      }
  ));
  return passport;
}

