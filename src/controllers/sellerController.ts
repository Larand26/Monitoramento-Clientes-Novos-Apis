import type { Request, Response } from "express";

import { getSellers as getSellersService } from "../services/sellerService.js";
import { getSellerById as getSellerByIdService } from "../services/sellerService.js";
import { createSeller as createSellerService } from "../services/sellerService.js";
import { updateSeller as updateSellerService } from "../services/sellerService.js";
import { deleteSeller as deleteSellerService } from "../services/sellerService.js";

export async function getSellers(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      created_start,
      created_end,
      page = 1,
      limit = 100,
    } = req.query;

    const serviceParams: Record<string, any> = {};

    if (name) serviceParams.name = String(name);
    if (created_start) serviceParams.created_start = String(created_start);
    if (created_end) serviceParams.created_end = String(created_end);

    const response = await getSellersService(
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
    console.error("Erro ao buscar vendedores:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function getSellerById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.query;

    if (Array.isArray(id) || !id) {
      res.status(400).json({
        success: false,
        message: "Parâmetro 'id' é obrigatório.",
      });
      return;
    }

    const response = await getSellerByIdService(String(id));

    if (!response.success) {
      res.status(404).json(response);
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao buscar vendedor por ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function createSeller(req: Request, res: Response): Promise<void> {
  try {
    interface ISeller {
      name: string;
      created_at?: Date;
    }

    const sellerData: ISeller = req.body;

    if (!sellerData.name) {
      res.status(400).json({
        success: false,
        message: "O campo 'name' é obrigatório.",
      });
      return;
    }

    if (!sellerData.created_at) sellerData.created_at = new Date();

    const response = await createSellerService(sellerData);

    if (!response.success) {
      res.status(400).json(response);
      return;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao criar vendedor:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function updateSeller(req: Request, res: Response): Promise<void> {
  try {
    const { id, seller } = req.body;

    if (!id || !seller) {
      res.status(400).json({
        success: false,
        message: "Parâmetros 'id' e 'seller' são obrigatórios.",
      });
      return;
    }

    const response = await updateSellerService(id, seller);

    if (!response.success) {
      res.status(400).json(response);
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao atualizar vendedor:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function deleteSeller(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Parâmetro 'id' é obrigatório.",
      });
      return;
    }

    const response = await deleteSellerService(id);

    if (!response.success) {
      res.status(400).json(response);
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao excluir vendedor:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}
