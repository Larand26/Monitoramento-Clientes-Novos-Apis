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
    page = 1,
    limit = 100,
  } = req.params;

  const filters = {
    status,
    cnpj,
    created_start,
    created_end,
    updated_start,
    updated_end,
    name,
    seller_id,
    page,
    limit,
  };

  const response = await getClientsService({
    status,
    cnpj,
    created_start,
    created_end,
    updated_start,
    updated_end,
    name,
    seller_id,
    page,
    limit,
  });
}
