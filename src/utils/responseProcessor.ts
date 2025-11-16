import type { ProcessTextResponse } from "../api/textProcessor";
import { formatMarkdownText } from "./formatUtils";

export interface ProcessedResponse {
  contentType: "text" | "table" | "chart";
  content: string;
  data?: unknown[];
  metadata?: {
    row_count?: number;
    execution_time_ms?: number;
    sql_query?: string;
  };
}

export function processResponse(
  response: ProcessTextResponse
): ProcessedResponse {
  if (response.data === null || response.data === undefined) {
    return {
      contentType: "text",
      content: response.content || "Нет данных для отображения",
      metadata: {
        sql_query: response.metadata?.sql_query,
      },
    };
  }

  const data = response.data;
  if (!Array.isArray(data) || data.length === 0) {
    return {
      contentType: "text",
      content: response.content || "Нет данных",
      metadata: {
        sql_query: response.metadata?.sql_query,
      },
    };
  }

  if (response.output_format === "text") {
    const firstItem = data[0];
    if (
      typeof firstItem === "object" &&
      firstItem !== null &&
      "text" in firstItem
    ) {
      const textContent = (firstItem as { text: string }).text;
      return {
        contentType: "text",
        content: formatMarkdownText(textContent || response.content || ""),
        metadata: {
          sql_query: response.metadata?.sql_query,
        },
      };
    }
    return {
      contentType: "text",
      content: formatMarkdownText(response.content || ""),
      metadata: {
        sql_query: response.metadata?.sql_query,
      },
    };
  }

  if (response.output_format === "table") {
    if (typeof data[0] === "object" && data[0] !== null) {
      return {
        contentType: "table",
        content: "📊 Результаты запроса",
        data: data,
        metadata: {
          row_count: response.row_count,
          execution_time_ms: response.execution_time_ms,
          sql_query: response.metadata?.sql_query,
        },
      };
    }
  }

  if (
    response.output_format === "chart" ||
    response.output_format === "graph"
  ) {
    if (typeof data[0] === "object" && data[0] !== null) {
      return {
        contentType: "chart",
        content: "📈 График данных",
        data: data,
        metadata: {
          row_count: response.row_count,
          execution_time_ms: response.execution_time_ms,
          sql_query: response.metadata?.sql_query,
        },
      };
    }
  }

  return {
    contentType: "text",
    content:
      `Найдено записей: ${data.length}\n\n` +
      JSON.stringify(data.slice(0, 10), null, 2) +
      (data.length > 10 ? `\n\n... и еще ${data.length - 10} записей` : ""),
    metadata: {
      sql_query: response.metadata?.sql_query,
    },
  };
}
