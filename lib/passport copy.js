
var db2 = require('../lib/db2');
var shortid = require('shortid');

module.exports = function(app){
    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth20').Strategy;
    
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

