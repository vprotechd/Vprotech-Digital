import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    courseSlug: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    offerPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    buttonText: {
      type: String,
      default: "View Course",
    },

    buttonLink: {
      type: String,
      default: "/courses",
    },

    // IMPORTANT
    isActive: {
      type: Boolean,
      default: true,
    },

    // IMPORTANT
    showPopup: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    priority: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;