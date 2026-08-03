import mongoose from "mongoose";
import appConfig from "../config/app.config.js";

const mongoURI = appConfig.mongodb.uri;

mongoose.connect(mongoURI);

export async function connectToMongoDB(): Promise<void> {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function disconnectFromMongoDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
}

export async function insertData(model: mongoose.Model<any>, data: any) {
  try {
    const newData = new model(data);
    await newData.save();
    console.log("Data added to MongoDB");
  } catch (error) {
    console.error("Error adding data to MongoDB:", error);
    process.exit(1);
  }
}
