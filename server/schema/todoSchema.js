import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "register",
      required: true,
    },
  },
  { timestamps: true }
);

const todo = mongoose.model("todo", todoSchema);

export default todo;
