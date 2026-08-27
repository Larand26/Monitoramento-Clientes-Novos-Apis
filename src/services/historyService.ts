import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

import StatusHistoryModel from "../models/status_history.model.js";
import { findData, insertData } from "../db/mongodb.js";
import { connectToMongoDB, disconnectFromMongoDB } from "../db/mongodb.js";

import { getClientsById } from "./clientsService.js";

export async function getHistory(filters: {
  id: string;
  id_type: string;
}): Promise<IResponse | IError> {
  try {
    // Pega _id do cliente
    const clientResponse = (await getClientsById(
      filters.id,
      filters.id_type,
    )) as IResponse | IError;

    if (
      !clientResponse.success ||
      !("data" in clientResponse) ||
      !clientResponse.data
    ) {
      return {
        success: false,
        message: "Cliente não encontrado.",
        archive: "src/services/historyService.ts",
        error: "ERR_CLIENT_NOT_FOUND",
      };
    }

    const client = clientResponse.data;
    const clientId = client._id;

    const history: any[] = await findData(
      StatusHistoryModel,
      { client_id: clientId },
      "status_history",
    );
    return {
      success: true,
      data: history,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/historyService.ts",
      error: "ERR_GET_HISTORY",
    };
  }
}

export async function insertHistory(data: any): Promise<IResponse | IError> {
  try {
    const result = await insertData(StatusHistoryModel, data, "status_history");
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/historyService.ts",
      error: "ERR_INSERT_HISTORY",
    };
  }
}
