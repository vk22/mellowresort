import { Nitro } from "nitropack";
import mongoose from "mongoose";

export default async (_nitroApp: Nitro) => {
  const config = useRuntimeConfig();
  try {
    console.log("mongodbUri", config.mongodbUri);
    await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB", config.mode);
  } catch (e) {
    console.error(e);
  }
};