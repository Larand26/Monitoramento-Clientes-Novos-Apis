import type { Request, Response } from "express";
import { getClients as getClientsService } from "../services/clientsService.js";
import { getClientsById as getClientByIdService } from "../services/clientsService.js";
import { createClient as createClientService } from "../services/clientsService.js";
import { updateClient as updateClientService } from "../services/clientsService.js";
import { deleteClient as deleteClientService } from "../services/clientsService.js";
import { addProjectedProfit as addProjectedProfitService } from "../services/clientsService.js";
import { generateClientsExcel } from "../services/excelService.js";
import { generateClientsPDF } from "../services/pdfService.js";

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
      min_orders,
      min_avg_days_between_purchases,
      store_id,
      page = 1,
      limit = 100,
    } = req.query;

    const serviceParams: Record<string, any> = {};

    if (status) serviceParams.status = String(status);
    if (cnpj) serviceParams.cnpj = String(cnpj);
    if (name) {
      serviceParams.name = { $regex: String(name), $options: "i" };
    }
    if (seller_id) serviceParams.seller_id = String(seller_id);
    if (min_orders) serviceParams.min_orders = Number(min_orders);
    if (store_id) serviceParams.store_id = String(store_id);
    if (created_start || created_end) {
      serviceParams.created_at = {};
      if (created_start)
        serviceParams.created_at.$gte = new Date(String(created_start));
      if (created_end)
        serviceParams.created_at.$lte = new Date(String(created_end));
    }

    // Filtro para datas de atualização (O que o seu React está chamando)
    if (updated_start || updated_end) {
      serviceParams.updated_at = {};
      if (updated_start)
        serviceParams.updated_at.$gte = new Date(String(updated_start));
      if (updated_end)
        serviceParams.updated_at.$lte = new Date(String(updated_end));
    }

    if (min_avg_days_between_purchases) {
      serviceParams.avg_days_between_purchases = {
        $gte: Number(min_avg_days_between_purchases),
      };
    }

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

export async function createClient(req: Request, res: Response): Promise<void> {
  try {
    interface IClient {
      magento_id: string;
      rd_station_id: string;
      store_id?: string;
      name: string;
      cnpj: string;
      seller_id?: string;
      magento_order_ids?: string[];
      store_order_ids?: string[];
      status: "IN_CRM" | "LOST" | "SUCCESS";
      projected_profit?: number;
      created_at?: Date;
      updated_at?: Date;
    }
    const clientData: IClient = req.body;
    if (!clientData.status) clientData.status = "IN_CRM";
    if (!clientData.seller_id) clientData.seller_id = "";
    if (!clientData.store_id) clientData.store_id = "";
    if (!clientData.updated_at) clientData.updated_at = new Date();
    if (!clientData.created_at) clientData.created_at = new Date();
    if (!clientData.magento_order_ids) clientData.magento_order_ids = [];
    if (!clientData.store_order_ids) clientData.store_order_ids = [];
    if (!clientData.projected_profit) clientData.projected_profit = 0;

    const response = await createClientService(clientData);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function updateClient(req: Request, res: Response): Promise<void> {
  try {
    const { id, client } = req.body;
    if (!id || !client) {
      res.status(400).json({
        success: false,
        message: "Parâmetros 'id' e 'client' são obrigatórios.",
      });
      return;
    }
    const response = await updateClientService(id, client);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function deleteClient(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Parâmetro 'id' é obrigatório.",
      });
      return;
    }
    const response = await deleteClientService(id);
    if (!response.success) {
      res.status(400).json(response);
      return;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function addProjectedProfit(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id, id_type, store_order_id, magento_order_id, projected_profit } =
      req.body;
    if (!id || !id_type || !store_order_id || projected_profit === undefined) {
      res.status(400).json({
        success: false,
        message:
          "Parâmetros 'id', 'id_type', 'store_order_id' e 'projected_profit' são obrigatórios.",
      });
      return;
    }

    if (
      Array.isArray(id) ||
      Array.isArray(id_type) ||
      Array.isArray(store_order_id) ||
      Array.isArray(magento_order_id)
    ) {
      res.status(400).json({
        success: false,
        message: "Os parâmetros informados devem ser valores escalares.",
      });
      return;
    }

    const parsedProjectedProfit = Number(projected_profit);

    if (Number.isNaN(parsedProjectedProfit)) {
      res.status(400).json({
        success: false,
        message: "'projected_profit' deve ser um número válido.",
      });
      return;
    }

    const response = await addProjectedProfitService(
      String(id),
      String(id_type),
      String(store_order_id),
      parsedProjectedProfit,
      magento_order_id ? String(magento_order_id) : undefined,
    );

    if (!response.success) {
      res.status(404).json(response);
      return;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao adicionar projected_profit:", error);
    res
      .status(500)
      .json({ success: false, message: "Erro interno do servidor." });
  }
}

export async function exportClients(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Corrigido para req.body pois a rota é um POST
    const {
      status,
      cnpj,
      created_start,
      created_end,
      updated_start,
      updated_end,
      name,
      seller_id,
      min_orders,
      min_avg_days_between_purchases,
      store_id,
      format,
    } = req.body;

    const serviceParams: Record<string, any> = {};

    if (status) serviceParams.status = String(status);
    if (cnpj) serviceParams.cnpj = String(cnpj);
    if (name) {
      serviceParams.name = { $regex: String(name), $options: "i" };
    }
    if (seller_id) serviceParams.seller_id = String(seller_id);
    if (min_orders) serviceParams.min_orders = Number(min_orders);
    if (store_id) serviceParams.store_id = String(store_id);

    if (created_start || created_end) {
      serviceParams.created_at = {};
      if (created_start)
        serviceParams.created_at.$gte = new Date(String(created_start));
      if (created_end)
        serviceParams.created_at.$lte = new Date(String(created_end));
    }

    if (updated_start || updated_end) {
      serviceParams.updated_at = {};
      if (updated_start)
        serviceParams.updated_at.$gte = new Date(String(updated_start));
      if (updated_end)
        serviceParams.updated_at.$lte = new Date(String(updated_end));
    }

    if (min_avg_days_between_purchases) {
      serviceParams.avg_days_between_purchases = {
        $gte: Number(min_avg_days_between_purchases),
      };
    }

    // Busca até 10.000 clientes (ajuste conforme o tamanho máximo da sua base real)
    const response = await getClientsService(serviceParams, 1, 10000);

    if (!response.success || !response.data) {
      res.status(400).json(response);
      return;
    }

    const clients = response.data;

    // Lógica de roteamento do formato
    if (format === "excel") {
      const excelBuffer = await generateClientsExcel(clients);

      // Define os headers para avisar o Front-end que isso é um arquivo xlsx
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="base_clientes.xlsx"',
      );

      // Envia o arquivo
      res.status(200).send(excelBuffer);
      return;
    }

    // Deixa o if do PDF preparado para a nossa próxima etapa
    if (format === "pdf") {
      const pdfBuffer = await generateClientsPDF(clients);

      // Define os headers para avisar o navegador que é um PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="base_clientes.pdf"',
      );

      // Envia o arquivo binário gerado
      res.status(200).send(pdfBuffer);
      return;
    }

    res.status(400).json({
      success: false,
      message: "Formato inválido. Use 'excel' ou 'pdf'.",
    });
  } catch (error) {
    console.error("Erro ao exportar clientes:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao gerar arquivo.",
    });
  }
}
