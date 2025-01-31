import Toast from "react-native-toast-message";

interface SerializedError {
  data: {
    statusCode: number;
    status: string;
    message: string;
  };
}

const isSerializedError = (error: unknown): error is SerializedError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    "message" in (error as SerializedError)?.data
  );
};

export const useApi = () => {
  const callMutationWithErrorHandler = async <T>(
    handlerFunc: () => Promise<T>
  ): Promise<T | void> => {
    try {
      const payload = await handlerFunc();
      return payload;
    } catch (error) {
      if (isSerializedError(error)) {
        Toast.show({
          type: "error",
          text1: "An error occurred",
          text2: error.data.message,
        });
      }
    }
  };

  return { callMutationWithErrorHandler };
};
