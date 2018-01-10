const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

//creating our schema(our rules for our model class)
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: {type: String, required: true}
})


//encrypting the password before it's saved to the database.
userSchema.pre("save", function(next) {
  //this step is needed if we use normal functions, as the value of "this"
  //when inside the bcrpyt function changes to bcrypt. However, if we use
  //arrow functions then the value of this is preserved
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)

      this.password = hash;
      next();
    })
  })
})

userSchema.methods.comparePassword = function(attempt, callback) {
  bcrypt.compare(attempt, this.password, function(err, res) {
    if (err) return callback(err)

    return callback(null, res)
  })
}


//creating the model class
const userModel = mongoose.model("user", userSchema)

//exporting it
module.exports = userModel
