import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

import StatusHistoryModel from "../models/status_history.model.js";
import { findData, insertData } from "../db/mongodb.js";
import { connectToMongoDB, disconnectFromMongoDB } from "../db/mongodb.js";

export async function getHistory(filters: any): Promise<IResponse | IError> {
  try {
    // Abre a conexão com o MongoDB
    await connectToMongoDB();

    // Busca o histórico com base nos filtros fornecidos
    const history: any[] = await findData(
      StatusHistoryModel,
      filters,
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
  } finally {
    // Fecha a conexão com o MongoDB
    await disconnectFromMongoDB();
  }
}

export async function insertHistory(data: any): Promise<IResponse | IError> {
  try {
    // Abre a conexão com o MongoDB
    await connectToMongoDB();

    // Insere o histórico no banco de dados
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
  } finally {
    // Fecha a conexão com o MongoDB
    await disconnectFromMongoDB();
  }
}
