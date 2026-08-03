export default interface IResponse {
  success: boolean;
  data: any | any[];
  pagination?: {
    total: number;
    page: number;
    total_pages: number;
  };
}
