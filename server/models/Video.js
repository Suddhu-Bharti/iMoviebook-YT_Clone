import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true},
    title: { type: String, required: true},
    desc: { type: String, default:""},
    imgUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    shares: { type: Number, default: 0},
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);