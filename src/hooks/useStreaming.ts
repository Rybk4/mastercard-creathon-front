import { useState, useCallback } from "react";
import { processTextStream } from "../api/textProcessor";
import type { ProcessTextResponse } from "../api/textProcessor";
import { processResponse } from "../utils/responseProcessor";
import type { ProcessedResponse } from "../utils/responseProcessor";
import { useUserIp } from "./useUserIp";

export function useStreaming() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userIp = useUserIp();

  const sendMessage = useCallback(
    async (
      message: string,
      onResponse: (processed: ProcessedResponse) => void,
      onError?: (error: string) => void
    ) => {
      setLoading(true);
      setError(null);

      const userId = userIp || "unknown";

      try {
        let lastResponse: ProcessTextResponse | null = null;

        await processTextStream(message, userId, (response) => {
          lastResponse = response;

          try {
            const processed = processResponse(response);
            onResponse(processed);
          } catch (processingError) {
            console.error("Ошибка при обработке ответа:", processingError);
            const errorMsg =
              processingError instanceof Error
                ? processingError.message
                : "Ошибка при обработке данных от сервера";
            if (onError) {
              onError(errorMsg);
            }
          }
        });

        if (lastResponse) {
          try {
            const processed = processResponse(lastResponse);
            onResponse(processed);
          } catch (processingError) {
            console.error(
              "Ошибка при обработке последнего ответа:",
              processingError
            );
            const errorMsg =
              processingError instanceof Error
                ? processingError.message
                : "Ошибка при обработке данных от сервера";
            if (onError) {
              onError(errorMsg);
            }
          }
        }
      } catch (err) {
        let errorMessage = "Произошла ошибка при отправке запроса";

        if (err instanceof TypeError && err.message.includes("fetch")) {
          errorMessage =
            "Ошибка сети: невозможно подключиться к серверу. Проверьте подключение к интернету и доступность сервера.";
        } else if (
          err instanceof TypeError &&
          err.message.includes("Failed to fetch")
        ) {
          errorMessage =
            "Ошибка сети: сервер недоступен. Проверьте URL сервера в настройках.";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }

        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [userIp]
  );

  return {
    loading,
    error,
    sendMessage,
    setError,
  };
}
