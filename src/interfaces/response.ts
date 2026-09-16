export default interface IResponse {
  success: true;
  data: any | any[];
  pagination?: {
    total: number;
    page: number;
    total_pages: number;
  };
}
