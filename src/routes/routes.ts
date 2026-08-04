import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import {
  getClients,
  getClientsById,
} from "../controllers/clientsController.js";

const routes = Router();

routes.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "Welcome to the API!" });
});

routes.get("/get-clients", getClients);

routes.get("/get-client-byid", getClientsById);

export default routes;
