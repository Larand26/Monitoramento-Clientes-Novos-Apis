import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

import sellerModel from "../models/seller.model.js";
import { findData, insertData, updateData, deleteData } from "../db/mongodb.js";
import { connectToMongoDB, disconnectFromMongoDB } from "../db/mongodb.js";

export async function getSellers(
  filters: any,
  page: number,
  limit: number,
): Promise<IResponse | IError> {
  try {
    const sellers: any[] = await findData(sellerModel, filters, "sellers");
    const totalSellers = sellers.length;

    return {
      success: true,
      data: sellers.slice((page - 1) * limit, page * limit),
      pagination: {
        total: totalSellers,
        page: page,
        total_pages: Math.ceil(totalSellers / limit),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/sellerService.ts",
      error: "ERR_GET_SELLERS",
    };
  }
}

export async function getSellerById(id: string): Promise<IResponse | IError> {
  try {
    const seller: any = await findData(sellerModel, { _id: id }, "sellers");

    if (!seller || seller.length === 0) {
      return {
        success: false,
        message: "Vendedor não encontrado.",
        archive: "src/services/sellerService.ts",
        error: "ERR_SELLER_NOT_FOUND",
      };
    }

    return {
      success: true,
      data: seller[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/sellerService.ts",
      error: "ERR_GET_SELLER_BY_ID",
    };
  }
}

export async function createSeller(
  sellerData: any,
): Promise<IResponse | IError> {
  try {
    const payload = {
      ...sellerData,
      created_at: sellerData.created_at ?? new Date(),
    };

    await insertData(sellerModel, payload, "sellers");

    return {
      success: true,
      data: payload,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/sellerService.ts",
      error: "ERR_CREATE_SELLER",
    };
  }
}

export async function updateSeller(
  id: string,
  sellerData: any,
): Promise<IResponse | IError> {
  try {
    const updatedSeller = await updateData(
      sellerModel,
      { _id: id },
      { $set: sellerData },
      "sellers",
    );

    return {
      success: true,
      data: updatedSeller,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/sellerService.ts",
      error: "ERR_UPDATE_SELLER",
    };
  }
}

export async function deleteSeller(id: string): Promise<IResponse | IError> {
  try {
    await deleteData(sellerModel, { _id: id }, "sellers");

    return {
      success: true,
      data: { id },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/sellerService.ts",
      error: "ERR_DELETE_SELLER",
    };
  }
}
