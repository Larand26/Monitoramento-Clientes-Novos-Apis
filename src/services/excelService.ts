import exceljs from "exceljs";
// Assumindo que o seu modelo de Vendedor se chama seller.model.js (Ajuste o caminho/nome se necessário)
import SellerModel from "../models/seller.model.js";

// Dicionário de tradução dos status
const statusMap: Record<string, string> = {
  FREEZE: "Esfriando",
  IN_CRM: "No CRM",
  LOST: "Perdido",
  SUCCESS: "Venda",
};

export async function generateClientsExcel(clients: any[]): Promise<Buffer> {
  // 1. Busca todos os vendedores no banco de dados
  const sellers = await SellerModel.find({}).lean();

  // 2. Cria um mapa (dicionário) para busca instantânea O(1): { "ID": "NOME" }
  const sellerMap: Record<string, string> = {};
  sellers.forEach((seller: any) => {
    // Garante que o ID seja uma string para comparar corretamente
    sellerMap[seller._id.toString()] = seller.name;
  });

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Clientes");

  worksheet.columns = [
    { header: "Nome", key: "name", width: 35 },
    { header: "CNPJ", key: "cnpj", width: 20 },
    { header: "Status", key: "status", width: 15 },
    { header: "Vendedor", key: "seller", width: 30 }, // Alterado para "Vendedor"
    { header: "ID da Loja", key: "store_id", width: 15 },
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  clients.forEach((client) => {
    // Aplica a tradução do status ou mantém o original se não encontrar no dicionário
    const translatedStatus = statusMap[client.status] || client.status || "-";

    // Busca o nome do vendedor no mapa usando o ID
    const sellerName =
      client.seller_id && sellerMap[client.seller_id.toString()]
        ? sellerMap[client.seller_id.toString()]
        : "Não atribuído";

    worksheet.addRow({
      name: client.name || "Sem Nome",
      cnpj: client.cnpj || "Sem CNPJ",
      status: translatedStatus,
      seller: sellerName,
      store_id: client.store_id || "-",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return buffer as unknown as Buffer;
}
