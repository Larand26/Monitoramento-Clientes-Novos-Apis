import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { getClients } from "../controllers/clientsController.js";

const routes = Router();

routes.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "Welcome to the API!" });
});

routes.get("/get-clients", getClients);

export default routes;
