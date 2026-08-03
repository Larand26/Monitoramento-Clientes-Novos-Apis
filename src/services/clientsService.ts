import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

export async function getClients(filters: any): Promise<IResponse | IError> {
  try {
    const clients: any[] = [];

    return {
      success: true,
      data: clients,
      pagination: {
        total: 0,
        page: 1,
        total_pages: 0,
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
