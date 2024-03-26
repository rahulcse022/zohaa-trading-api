const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "user",
    },
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
    },
    // firstName: {
    //   type: String,
    //   required: [true, "Please provide Firstname!"],
    // },
    // lastName: {
    //   type: String,
    //   required: [true, "Please provide Lastname!"],
    // },
    userName: {
      type: String,
      required: [true, "Please provide Username!"],
      unique: {value:true, message:'Username already taken'},
    },
    email: {
      type: String,
      required: [true, "Please provide Email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide Password!"],
    },
    // country: {
    //   type: String,
    //   required: [true, "Please provide Country!"],
    // },
    state: {
      type: String,
      default: "",
      // required: [true, 'Please provide State!'],
    },
    city: {
      type: String,
      default: "",
      // required: [true, 'Please provide State!'],
    },
    address: {
      type: String,
      default: "",
      required: [true, "Please provide address"],

    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide Phone Number!"],
      unique: true,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    totalProfit: {
      type: Number,
    },
    totalDeposite: {
      type: Number,
    },
    totalWithDrawal: {
      type: Number,
    },
    blockNumber: Number,
    walletAddress: {
      type: String,
    },
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "UserWithdrawal" },
    ],
    stackId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stack" }],
    tokenId: [{ type: mongoose.Schema.Types.ObjectId, ref: "TokenHistory" }],
    token: String,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Number,
    updateToken: String,
    updateTokenExpiresAt: Number,
    updatedFields: Object,
    profileImage: { type: String } // This field will store the image URL or file path
  },
  {
    timestamps: true,
  }
);
UserSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.role;
    delete userObject.token;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpiresAt;
    delete userObject.tokenId;
    delete userObject.updatedFields;
    delete userObject.updateTokenExpiresAt;
    delete userObject.updateToken;
    return userObject;
}
module.exports = mongoose.model('User', UserSchema);
