import type { Request, Response } from "express";
import { getHistory as getHistoryService } from "../services/historyService.js";
import { insertHistory as insertHistoryService } from "../services/historyService.js";

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

export async function insertHistory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const {
      client_id,
      previous_status,
      new_status,
      order_id = "",
      projected_profit = 0,
    } = req.body;

    if (!client_id || !previous_status || !new_status) {
      res.status(400).json({
        success: false,
        message:
          "Todos os campos são obrigatórios: 'client_id', 'previous_status', 'new_status'.",
      });
      return;
    }

    const data: any = {};
    data.client_id = client_id;
    data.previous_status = previous_status;
    data.new_status = new_status;
    data.changed_at = new Date();
    data.order_id = order_id;
    data.projected_profit = projected_profit;

    const response = await insertHistoryService(data);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao inserir histórico:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}
