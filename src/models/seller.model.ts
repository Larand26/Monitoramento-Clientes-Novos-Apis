import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, required: true },
});

const sellerModel = mongoose.model("Seller", sellerSchema, "sellers");
export default sellerModel;
