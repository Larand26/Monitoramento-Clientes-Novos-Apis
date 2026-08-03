import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "Welcome to the API!" });
});

routes.get(
  "/get-clients/:status/:cnpj/:created_start/:created_end/:updated_start/:updated_end/:name/:seller_id/:page/:limit",
  (req: Request, res: Response, next: NextFunction) => {
    return res.json({ message: "Get clients endpoint" });
  },
);

export default routes;
