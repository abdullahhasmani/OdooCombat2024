import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "products",
      },
    ],
    quantity:{
      type:Number,
    },
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Deliverd", "Cancel"],
    },
    rentFrom:{
      type:Date
    },
    rentTill:{
      type:Date
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);