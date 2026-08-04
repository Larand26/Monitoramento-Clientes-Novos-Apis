import type { Request, Response } from "express";
import { getClients as getClientsService } from "../services/clientsService.js";

export async function getClients(req: Request, res: Response): Promise<void> {
  try {
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
    } = req.query;

    const serviceParams: Record<string, any> = {};

    if (status) serviceParams.status = String(status);
    if (cnpj) serviceParams.cnpj = String(cnpj);
    if (created_start) serviceParams.created_start = String(created_start);
    if (created_end) serviceParams.created_end = String(created_end);
    if (updated_start) serviceParams.updated_start = String(updated_start);
    if (updated_end) serviceParams.updated_end = String(updated_end);
    if (name) serviceParams.name = String(name);
    if (seller_id) serviceParams.seller_id = String(seller_id);

    const response = await getClientsService(
      serviceParams,
      Number(page),
      Number(limit),
    );

    if (!response.success) {
      res.status(400).json(response);
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}
