import PDFDocument from "pdfkit-table";
import SellerModel from "../models/seller.model.js";

const statusMap: Record<string, string> = {
  FREEZE: "Esfriando",
  IN_CRM: "No CRM",
  LOST: "Perdido",
  SUCCESS: "Venda",
};

export async function generateClientsPDF(clients: any[]): Promise<Buffer> {
  const sellers = await SellerModel.find({}).lean();
  const sellerMap: Record<string, string> = {};
  sellers.forEach((seller: any) => {
    sellerMap[seller._id.toString()] = seller.name;
  });

  return new Promise((resolve, reject) => {
    try {
      // Contorno para o erro de 'construct signature' do TypeScript
      const PDFDocumentClass = PDFDocument as any;
      const doc = new PDFDocumentClass({
        margin: 30,
        size: "A4",
        layout: "landscape",
      });

      const buffers: Buffer[] = [];

      // Tipagem explícita adicionada ao parâmetro chunk (Buffer)
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const tableRows = clients.map((client) => {
        const translatedStatus =
          statusMap[client.status] || client.status || "-";
        const sellerName =
          client.seller_id && sellerMap[client.seller_id.toString()]
            ? sellerMap[client.seller_id.toString()]
            : "Não atribuído";

        return [
          client.name || "Sem Nome",
          client.cnpj || "Sem CNPJ",
          translatedStatus,
          sellerName,
          client.store_id || "-",
        ];
      });

      const table = {
        title: "Relatório de Clientes da Base",
        subtitle: `Gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
        headers: [
          { label: "Nome", property: "name", width: 200 },
          { label: "CNPJ", property: "cnpj", width: 100 },
          { label: "Status", property: "status", width: 80 },
          { label: "Vendedor", property: "seller", width: 200 },
          { label: "ID da Loja", property: "store_id", width: 80 },
        ],
        rows: tableRows,
      };

      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: () => doc.font("Helvetica").fontSize(9),
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
