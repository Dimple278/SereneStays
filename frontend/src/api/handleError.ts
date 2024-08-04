import axios, { AxiosError } from "axios";
interface ErrorResponse {
  message: string;
}

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message || "An error occurred");
    }
  }
  throw new Error("An unexpected error occurred");
};
