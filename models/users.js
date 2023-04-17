const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    
  },
  avatarUrl: {
    type: String,
  },
  source:{
    type: String
  },
  accessToken:{
    type:String
  },
});

module.exports = mongoose.model("User", UserSchema);
