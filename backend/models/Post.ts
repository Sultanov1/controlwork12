import mongoose, {model, Schema} from "mongoose";
import User from "./User";
import {PostDocument} from "../types";

const PostSchema = new Schema<PostDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => await User.findById(value),
      message: 'User not find!',
    },
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
})

const Post = model<PostDocument>('Post', PostSchema);

export default Post;
