const Users = require("../models/users")
const jwt = require("jsonwebtoken");
const config = require("../config")


function generateToken(id) {
  //sub means subject, iat means issued at time, exp means expiry. We are setting it to expire in 1 day
  const token = jwt.sign({
    sub: id,
    iat: Date.now(),
    exp: (Date.now()/1000)+(60*60*24)
  }, config.SECRET_STRING);
  return token
}


//signup function that uses body parser(this file is imported into index.js so has access to it)
//if all is well, we can make a new user from the User Model and then call save on it.
module.exports.signup = function(req, res, next) {
  //get info from request object
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) return res.status(422).send({ error: "Both email and password are required" })
  //check if user already exists with that email.
  Users.findOne({email}, function(err, match) {
    //if database error
    if (err) return next(err)
    if (match) {
      return res.status(422).send({ error: "Email already in use" })
    }

    const user = new Users({ email, password });
    //user has a method on it that encrypts the password just before it gets saved.
    //this means we do not save the password to our database in plain text
    user.save(function(err) {
      if (err) return next(err);
      else return res.status(201).send({ message: "User created!", token: generateToken(user.id)})
    })
  })
}


module.exports.signin = function(req, res) {
  res.send({ token: generateToken(req.user._id) })
}
