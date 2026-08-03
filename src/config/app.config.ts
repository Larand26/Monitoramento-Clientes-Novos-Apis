import dotenv from "dotenv";
dotenv.config();

export default {
  api: {
    port: process.env.PORT || 3000,
    mode: process.env.MODE || "production",
    tokenSecret: process.env.TOKEN_SECRET || "default_secret",
  },
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase",
  },
};
