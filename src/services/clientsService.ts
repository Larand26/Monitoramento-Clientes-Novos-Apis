import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

import ClientModel from "../models/client.model.js";
import { findData, insertData, updateData } from "../db/mongodb.js";
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

export async function getClientsById(
  id: string,
  id_type: string,
): Promise<IResponse | IError> {
  try {
    // Abre a conexão com o MongoDB
    await connectToMongoDB();
    // Busca o cliente com base no ID e tipo de ID fornecidos
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
  } finally {
    // Fecha a conexão com o MongoDB
    await disconnectFromMongoDB();
  }
}

export async function createClient(
  clientData: any,
): Promise<IResponse | IError> {
  try {
    // Abre a conexão com o MongoDB
    await connectToMongoDB();
    // Cria um novo cliente no banco de dados
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
  } finally {
    // Fecha a conexão com o MongoDB
    await disconnectFromMongoDB();
  }
}

export async function updateClient(
  id: string,
  clientData: any,
): Promise<IResponse | IError> {
  try {
    // Abre a conexão com o MongoDB
    await connectToMongoDB();
    // Atualiza o cliente no banco de dados
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
  } finally {
    // Fecha a conexão com o MongoDB
    await disconnectFromMongoDB();
  }
}
