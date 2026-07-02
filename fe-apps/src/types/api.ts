// Generic wrapper for all BE responses — reusable across any API module
export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Generic pagination meta — reusable across any list endpoint
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
