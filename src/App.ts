import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

export default class App {
  server: express.Express;
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(
      cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );
    this.server.use(express.json());
  }

  routes() {
    this.server.use("/api/v1", routes);
  }
}
