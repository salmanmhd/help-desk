import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    view_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export { Article };
