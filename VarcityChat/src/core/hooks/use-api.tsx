import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useToast } from "./use-toast";

interface SerializedError {
  data: {
    statusCode: number;
    status: string;
    message: string;
  };
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

const isSerializedError = (error: any): error is SerializedError => {
  return (
    typeof error === "object" &&
    error !== null &&
    error["data"] &&
    typeof error["data"] === "object" &&
    "message" in error["data"]
  );
};

export const useApi = () => {
  const { showToast } = useToast();

  const callMutationWithErrorHandler = async <T,>(
    handlerFunc: () => Promise<T>
  ): Promise<{ data?: T; error?: string; isError: boolean }> => {
    try {
      const payload = await handlerFunc();
      return { data: payload, isError: false };
    } catch (error) {
      let errorMessage = "Something went wrong";
      // if (isFetchBaseQueryError(error)) {
      //   errorMessage =
      //     "API Error:" + (error.data ? JSON.stringify(error.data) : "Unknown");
      // } else

      if (isSerializedError(error)) {
        errorMessage = error.data.message;
      }

      showToast({
        type: "error",
        text1: "An error occurred",
        text2: errorMessage,
      });
      return { error: errorMessage, isError: true };
    }
  };

  return { callMutationWithErrorHandler };
};
