import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;
interface IGroup {
  name: string;
}
const groupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Group", groupSchema);
