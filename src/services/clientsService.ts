import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

import ClientModel from "../models/client.model.js";
import { findData } from "../db/mongodb.js";
import { connectToMongoDB, disconnectFromMongoDB } from "../db/mongodb.js";

export async function getClients(
  filters: any,
  page: number,
  limit: number,
): Promise<IResponse | IError> {
  try {
    // Abre a conexão com o MongoDB
    await connectToMongoDB();

    // Busca os clientes com base nos filtros fornecidos
    const clients: any[] = await findData(ClientModel, filters, "clients");
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
  } finally {
    // Fecha a conexão com o MongoDB
    await disconnectFromMongoDB();
  }
}
