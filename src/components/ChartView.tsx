import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartViewProps {
  title: string;
  data: unknown[];
  metadata?: {
    row_count?: number;
    execution_time_ms?: number;
  };
}

export const ChartView: React.FC<ChartViewProps> = ({
  title,
  data,
  metadata,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const firstRow = data[0] as Record<string, unknown>;
  const keys = Object.keys(firstRow);
  const xAxisKey = keys[0];
  const dataKeys = keys.slice(1);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: 400, mb: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data as Record<string, unknown>[]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={
                  idx === 0
                    ? "#1976d2"
                    : idx === 1
                    ? "#dc004e"
                    : `hsl(${(idx * 60) % 360}, 70%, 50%)`
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
      {metadata && (
        <Typography variant="caption" color="text.secondary">
          Всего записей: {metadata.row_count ?? data.length}
          {metadata.execution_time_ms !== undefined &&
            ` | Время выполнения: ${(metadata.execution_time_ms / 1000).toFixed(
              2
            )} сек`}
        </Typography>
      )}
    </Box>
  );
};
