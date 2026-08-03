export default interface IResponse {
  success: boolean;
  data: any;
  pagination?: {
    total: number;
    page: number;
    total_pages: number;
  };
}
