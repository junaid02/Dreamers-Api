import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;
interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  groups: Types.ObjectId;
}
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: "00000000000",
  },
  password: {
    type: String,
    required: true,
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
