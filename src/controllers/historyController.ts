import type { Request, Response } from "express";
import { getHistory as getHistoryService } from "../services/historyService.js";

export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const { id, id_type } = req.query;

    if (!id || !id_type) {
      res.status(400).json({
        success: false,
        message: "Parâmetros 'id' e 'id_type' são obrigatórios.",
      });
      return;
    }

    const filters: any = {};
    filters[id_type as string] = id;

    const response = await getHistoryService(filters);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}
