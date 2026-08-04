import type { Request, Response } from "express";
import { getClients as getClientsService } from "../services/clientsService.js";
import { getClientsById as getClientByIdService } from "../services/clientsService.js";

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

export async function getClientsById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id, id_type } = req.query;

    if (Array.isArray(id) || Array.isArray(id_type) || !id || !id_type) {
      res.status(400).json({
        success: false,
        message: "Parâmetros 'id' e 'id_type' são obrigatórios.",
      });
      return;
    }

    const response = await getClientByIdService(String(id), String(id_type));
    if (!response.success) {
      res.status(404).json(response);
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}
