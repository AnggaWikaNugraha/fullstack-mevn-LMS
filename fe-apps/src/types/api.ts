// Generic wrapper for all BE responses — reusable across any API module
export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
