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

import {
  getSellers,
  getSellerById,
  createSeller,
  updateSeller,
  deleteSeller,
} from "../controllers/sellerController.js";

import { getHistory, insertHistory } from "../controllers/historyController.js";

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

routes.get("/get-sellers", getSellers);

routes.get("/get-seller-byid", getSellerById);

routes.put("/update-seller", updateSeller);

routes.post("/create-seller", createSeller);

routes.delete("/delete-seller", deleteSeller);

routes.get("/get-client-history", getHistory);

routes.post("/insert-status-history", insertHistory);

export default routes;
