const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const Users = require("../models/users");
const config = require("../config");
const LocalStrategy = require("passport-local")

//telling JwtStrategy where to find the jwt and also what the secret string is
//so that the strategy can decode it.
var JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.SECRET_STRING
}

//this function is used for our get Authorized content where the user will
//aready have a token. The function decodes the json web token and then we can
//make a request to the database to see if we get a match. if so, user is authenticated.
var JwtLogin = new JwtStrategy(JwtOptions, function(payload, done) {
  Users.findById(payload.sub, function(err, user) {
    //if we have an error with the database
    if (err) return done(err, false)
    if (!user) return done(null, false)
    
    return done(null, user)
  })
})

var LocalOptions = {
  usernameField: "email"
}

const localLogin = new LocalStrategy(LocalOptions, function(email, password, done) {
  Users.findOne({email}, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false)

    return done(null, user)
  })
})

passport.use(JwtLogin);
passport.use(localLogin)
