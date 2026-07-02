export interface ApiResponse<T> {
  data: {
    status: number;
    result: string;
    response: T; // ← generic — har feature ka alag type aayega
  };
}
