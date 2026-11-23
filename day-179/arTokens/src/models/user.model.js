const { default: mongoose } = require('mongoose');

let userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: { type: String, required: true },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

let UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
