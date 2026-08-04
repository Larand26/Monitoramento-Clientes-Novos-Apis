import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import {
  getClients,
  getClientsById,
  createClient,
  updateClient,
  deleteClient,
  addProjectedProfit,
} from "../controllers/clientsController.js";

const routes = Router();

routes.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "Welcome to the API!" });
});

routes.get("/get-clients", getClients);

routes.get("/get-client-byid", getClientsById);

routes.put("/update-client", updateClient);

routes.post("/create-client", createClient);

routes.post("/add-projected-profit", addProjectedProfit);

routes.delete("/delete-client", deleteClient);

export default routes;
