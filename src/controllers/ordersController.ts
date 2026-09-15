import type { Request, Response } from "express";
import {
  getOrders as getOrdersService,
  getOrderById as getOrderByIdService,
  createOrder as createOrderService,
  updateOrder as updateOrderService,
  deleteOrder as deleteOrderService,
} from "../services/ordersService.js";

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const {
      client_id,
      seller_id,
      store_order_id,
      date_start,
      date_end,
      page = 1,
      limit = 100,
    } = req.query;

    const serviceParams: Record<string, any> = {};

    if (client_id) serviceParams.client_id = String(client_id);
    if (seller_id) serviceParams.seller_id = String(seller_id);
    if (store_order_id) serviceParams.store_order_id = String(store_order_id);

    // Filtro por período (order_date)
    if (date_start || date_end) {
      serviceParams.order_date = {};
      if (date_start) serviceParams.order_date.$gte = String(date_start);
      if (date_end) serviceParams.order_date.$lte = String(date_end);
    }

    const response = await getOrdersService(
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
    console.error("Erro ao buscar pedidos:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const { id, id_type } = req.query;

    if (Array.isArray(id) || Array.isArray(id_type) || !id || !id_type) {
      res.status(400).json({
        success: false,
        message: "Parâmetros 'id' e 'id_type' são obrigatórios.",
      });
      return;
    }

    const response = await getOrderByIdService(String(id), String(id_type));
    if (!response.success) {
      res.status(404).json(response);
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao buscar pedido por ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const orderData = req.body;

    if (!orderData.store_order_id || !orderData.total_amount) {
      res.status(400).json({
        success: false,
        message: "Campos obrigatórios (store_order_id, total_amount) ausentes.",
      });
      return;
    }

    // Define uma data padrão caso não venha no body
    if (!orderData.order_date) {
      orderData.order_date = new Date().toISOString();
    }

    const response = await createOrderService(orderData);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id, order } = req.body;
    if (!id || !order) {
      res.status(400).json({
        success: false,
        message: "Parâmetros 'id' e 'order' são obrigatórios.",
      });
      return;
    }
    const response = await updateOrderService(id, order);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Parâmetro 'id' é obrigatório.",
      });
      return;
    }
    const response = await deleteOrderService(id);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}
