import { config } from "@/constants/config";

export interface ProcessTextRequest {
  natural_language_query: string;
  user_id: string;
  model: "api" | "llm";
}

export interface ProcessTextResponse {
  content?: string;
  output_format?: string;
  data?: unknown[] | null;
  row_count?: number;
  execution_time_ms?: number;
  metadata?: {
    sql_query?: string;
    validation_notes?: string;
    execution_time_ms?: number;
    row_count?: number;
  };
}

export type StreamChunkHandler = (response: ProcessTextResponse) => void;

export async function processTextStream(
  message: string,
  userId: string,
  model: "api" | "llm",
  onChunk: StreamChunkHandler
): Promise<void> {
  const API_URL = `${config.apiUrl}/process-text`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      natural_language_query: message,
      user_id: userId,
      model: model,
    } as ProcessTextRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorDetail =
      errorData.detail ||
      errorData.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorDetail);
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedData = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        if (accumulatedData.trim()) {
          try {
            const parsed = JSON.parse(accumulatedData) as ProcessTextResponse;
            onChunk(parsed);
          } catch (parseError) {
            // Если это последний чанк и он не парсится, возможно это ошибка от сервера
            console.warn("Ошибка парсинга последнего чанка:", parseError);
            // Пытаемся извлечь текст ошибки из accumulatedData
            if (accumulatedData.trim()) {
              throw new Error(
                `Ошибка парсинга ответа сервера: ${accumulatedData
                  .trim()
                  .substring(0, 200)}`
              );
            }
          }
        }
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      accumulatedData += chunk;

      const lines = accumulatedData.split("\n");
      accumulatedData = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line) as ProcessTextResponse;
            onChunk(parsed);
          } catch (parseError) {
            // Игнорируем ошибки парсинга промежуточных данных, но логируем
            console.warn(
              "Ошибка парсинга промежуточного чанка:",
              parseError,
              line
            );
          }
        }
      }
    }
  } catch (readError) {
    // Ошибки при чтении потока
    if (readError instanceof Error && !readError.message.includes("парсинга")) {
      throw readError;
    }
    throw new Error(
      `Ошибка при чтении потока данных: ${
        readError instanceof Error ? readError.message : String(readError)
      }`
    );
  }
}

export async function clearHistory(userId: string): Promise<void> {
  const API_URL = `${config.apiUrl}/clear-history`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorDetail =
      errorData.detail ||
      errorData.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorDetail);
  }
}
