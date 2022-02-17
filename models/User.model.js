// User validation Schema 
const {Schema, model} = require("mongoose")

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true,
  },

  
  email: {
    type: String,
    required: [true, 'Email is required.'],
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  }
},
{timestamp: true,}
)




module.exports = model("User",userSchema)
