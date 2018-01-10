const authentication = require("./controllers/authentication");
const loginCheck = require("./services/passport");
const passport = require("passport");


//We will have 3 authentication strategies. One for signing up, where we check that
//email is not already in use. One for authenticated requests, where we use passport
//to check that our jwt is correct and then make a database request for the user from
//the decoded jwt. And finally a signin route, which we use passport again to
//search through the database for a user with the required email. We then use a method
//on the user that calls bcrypts compare method. This encrypts the given password and then
//compares it to the password in the database. If correct, we can then give the signed in
//user a token.


const requireAuth = passport.authenticate("jwt", {session: false})
const requireSignIn = passport.authenticate("local", {session: false})

module.exports = function(app) {
  app.get("/", requireAuth, function(req,res) {
    res.send("hey")
  })
  app.post("/signin", requireSignIn, authentication.signin)
  app.post("/signup", authentication.signup)
}
