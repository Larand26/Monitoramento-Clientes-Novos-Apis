import type IResponse from "../interfaces/response.js";
import type IError from "../interfaces/error.js";

import OrderModel from "../models/order.model.js";
import { findData, insertData, updateData, deleteData } from "../db/mongodb.js";

export async function getOrders(
  filters: any,
  page: number,
  limit: number,
): Promise<IResponse | IError> {
  try {
    const orders: any[] = await findData(OrderModel, filters, "orders");
    const totalOrders = orders.length;
    return {
      success: true,
      data: orders.slice((page - 1) * limit, page * limit),
      pagination: {
        total: totalOrders,
        page: page,
        total_pages: Math.ceil(totalOrders / limit),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/ordersService.ts",
      error: "ERR_GET_ORDERS",
    };
  }
}

export async function getOrderById(
  id: string,
  id_type: string,
): Promise<IResponse | IError> {
  try {
    const order: any = await findData(OrderModel, { [id_type]: id }, "orders");
    if (!order || order.length === 0) {
      return {
        success: false,
        message: "Pedido não encontrado.",
        archive: "src/services/ordersService.ts",
        error: "ERR_ORDER_NOT_FOUND",
      };
    }
    return {
      success: true,
      data: order[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/ordersService.ts",
      error: "ERR_GET_ORDER_BY_ID",
    };
  }
}

export async function createOrder(orderData: any): Promise<IResponse | IError> {
  try {
    await insertData(OrderModel, orderData, "orders");

    return {
      success: true,
      data: orderData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/ordersService.ts",
      error: "ERR_CREATE_ORDER",
    };
  }
}

export async function updateOrder(
  id: string,
  orderData: any,
): Promise<IResponse | IError> {
  try {
    const updatedOrder = await updateData(
      OrderModel,
      { _id: id },
      { $set: orderData },
      "orders",
    );
    return {
      success: true,
      data: updatedOrder,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/ordersService.ts",
      error: "ERR_UPDATE_ORDER",
    };
  }
}

export async function deleteOrder(id: string): Promise<IResponse | IError> {
  try {
    await deleteData(OrderModel, { _id: id }, "orders");

    return {
      success: true,
      data: { id },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
      archive: "src/services/ordersService.ts",
      error: "ERR_DELETE_ORDER",
    };
  }
}
