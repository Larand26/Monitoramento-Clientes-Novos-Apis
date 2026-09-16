import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

import ClientModel from "../models/client.model.js";
import { findData, insertData, updateData, deleteData } from "../db/mongodb.js";
import { connectToMongoDB, disconnectFromMongoDB } from "../db/mongodb.js";

export async function getClients(
  filters: any,
  page: number,
  limit: number,
): Promise<IResponse | IError> {
  try {
    const { min_orders, ...dbFilters } = filters;

    let clients: any[] = [];

    if (min_orders !== undefined && min_orders !== "") {
      clients = await ClientModel.aggregate([
        { $match: dbFilters },

        {
          $lookup: {
            from: "orders",
            localField: "_id", // A chave primária no ClientModel
            foreignField: "client_id", // A chave estrangeira lá na tabela de Orders
            as: "client_orders", // Nome do array temporário onde os pedidos serão injetados
          },
        },

        // Passo C: Cria um campo virtual contando quantos pedidos vieram no join
        {
          $addFields: {
            total_orders: { $size: "$client_orders" },
          },
        },

        // Passo D: O equivalente ao "HAVING" do SQL, filtra os que têm o mínimo de pedidos
        {
          $match: {
            total_orders: { $gte: Number(min_orders) },
          },
        },

        {
          $project: { client_orders: 0 },
        },
      ]);
    } else {
      // 3. Se não tem filtro de min_orders, usamos a sua busca original mais leve
      clients = await findData(ClientModel, dbFilters, "clients");
    }

    const totalClients = clients.length;

    return {
      success: true,
      data: clients.slice((page - 1) * limit, page * limit),
      pagination: {
        total: totalClients,
        page: page,
        total_pages: Math.ceil(totalClients / limit),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/clientsService.ts",
      error: "ERR_GET_CLIENTS",
    };
  }
}

export async function getClientsById(
  id: string,
  id_type: string,
): Promise<IResponse | IError> {
  try {
    const client: any = await findData(
      ClientModel,
      { [id_type]: id },
      "clients",
    );
    if (!client || client.length === 0) {
      return {
        success: false,
        message: "Cliente não encontrado.",
        archive: "src/services/clientsService.ts",
        error: "ERR_CLIENT_NOT_FOUND",
      };
    }
    return {
      success: true,
      data: client[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/clientsService.ts",
      error: "ERR_GET_CLIENT_BY_ID",
    };
  }
}

export async function createClient(
  clientData: any,
): Promise<IResponse | IError> {
  try {
    await insertData(ClientModel, clientData, "clients");

    return {
      success: true,
      data: clientData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/clientsService.ts",
      error: "ERR_CREATE_CLIENT",
    };
  }
}

export async function updateClient(
  id: string,
  clientData: any,
): Promise<IResponse | IError> {
  try {
    const updatedClient = await updateData(
      ClientModel,
      { _id: id },
      { $set: clientData },
      "clients",
    );
    return {
      success: true,
      data: updatedClient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/clientsService.ts",
      error: "ERR_UPDATE_CLIENT",
    };
  }
}

export async function deleteClient(id: string): Promise<IResponse | IError> {
  try {
    await deleteData(ClientModel, { _id: id }, "clients");

    return {
      success: true,
      data: { id },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/clientsService.ts",
      error: "ERR_DELETE_CLIENT",
    };
  }
}

export async function addProjectedProfit(
  id: string,
  idType: string,
  storeOrderId: string,
  projectedProfit: number,
  magentoOrderId?: string,
): Promise<IResponse | IError> {
  try {
    const updatePayload: Record<string, any> = {
      $addToSet: {
        store_order_ids: storeOrderId,
      },
      $inc: {
        projected_profit: projectedProfit,
      },
    };

    if (magentoOrderId) {
      updatePayload.$addToSet.magento_order_ids = magentoOrderId;
    }

    const updatedClient = await ClientModel.findOneAndUpdate(
      { [idType]: id },
      updatePayload,
      { new: true },
    );

    if (!updatedClient) {
      return {
        success: false,
        message: "Cliente não encontrado.",
        archive: "src/services/clientsService.ts",
        error: "ERR_CLIENT_NOT_FOUND",
      };
    }

    return {
      success: true,
      data: updatedClient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/clientsService.ts",
      error: "ERR_ADD_PROJECTED_PROFIT",
    };
  }
}
