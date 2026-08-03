import type { Request, Response, NextFunction } from "express";
import config from "../config/app.config.js";

export default function validateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token da API não presente.",
      archive: "src/middlewares/validateToken.ts",
      error: "ERR_API_TOKEN_MISSING",
    });
  }
  const expectedToken = config.api.tokenSecret;
  if (token !== expectedToken) {
    return res.status(401).json({
      success: false,
      message: "Acesso negado. Token inválido.",
      archive: "src/middlewares/validateToken.ts",
      error: "ERR_INTERNAL_UNAUTHORIZED",
    });
  }
  next();
}
