import mongoose from "mongoose";

const imageDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageName: {
      type: String,
      required: [true, "Image name is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    details: [
      {
        name: {
          type: String,
          required: [true, "Name is required"],
          trim: true,
        },
        panNumber: {
          type: String,
          required: [true, "PAN number is required"],
          match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"],
          uppercase: true,
        },
        // Add more fields as needed
      }
    ],
    summary: {
      type: String,
      trim: true,
      maxlength: [500, "Summary can not exceed 500 characters"],
    },
  },
  { timestamps: true }
);

const ImageDetails = mongoose.model("ImageDetails", imageDetailsSchema);
export default ImageDetails;
