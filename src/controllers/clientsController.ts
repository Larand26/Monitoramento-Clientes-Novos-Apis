import type { Request, Response } from "express";

// Services
import { getClients as getClientsService } from "../services/clientsService.js";

// Busca os clientes com base nos parâmetros fornecidos na URL
export async function getClients(req: Request, res: Response): Promise<void> {
  const {
    status,
    cnpj,
    created_start,
    created_end,
    updated_start,
    updated_end,
    name,
    seller_id,
    page = "1",
    limit = "100",
  } = req.query;

  const response = await getClientsService({
    status: String(status ?? ""),
    cnpj: String(cnpj ?? ""),
    created_start: String(created_start ?? ""),
    created_end: String(created_end ?? ""),
    updated_start: String(updated_start ?? ""),
    updated_end: String(updated_end ?? ""),
    name: String(name ?? ""),
    seller_id: String(seller_id ?? ""),
    page: Number(page),
    limit: Number(limit),
  });

  if (!response.success) {
    res.status(500).json(response);
    return;
  }

  res.status(200).json(response);
}
