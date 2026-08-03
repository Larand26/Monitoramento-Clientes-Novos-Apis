import dotenv from "dotenv";
dotenv.config();

export default {
  api: {
    port: process.env.PORT || 3000,
    mode: process.env.MODE || "production",
    tokenSecret: process.env.TOKEN_SECRET || "default_secret",
  },
};
