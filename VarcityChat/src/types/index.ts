export interface IPaginatedData<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface IPaginatedPayload {
  page: number;
  limit: number;
}
