import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  previous_status: {
    type: String,
    required: true,
    enum: ["IN_CRM", "LOST", "SUCCESS"],
  },
  new_status: {
    type: String,
    required: true,
    enum: ["IN_CRM", "LOST", "SUCCESS"],
  },
  order_value: { type: Number, required: true },
  changed_at: { type: Date, required: true },
  order_id: { type: String, required: true },
});

const StatusHistoryModel = mongoose.model(
  "StatusHistory",
  statusHistorySchema,
  "status_history",
);
export default StatusHistoryModel;
