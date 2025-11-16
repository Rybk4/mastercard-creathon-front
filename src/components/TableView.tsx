import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface TableViewProps {
  title: string;
  data: unknown[];
  metadata?: {
    row_count?: number;
    execution_time_ms?: number;
  };
}

export const TableView: React.FC<TableViewProps> = ({
  title,
  data,
  metadata,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const firstRow = data[0] as Record<string, unknown>;
  const keys = Object.keys(firstRow);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <TableContainer sx={{ maxHeight: 400, mb: 1 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {keys.map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "background.default",
                  }}
                >
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, 100).map((row, idx) => (
              <TableRow key={idx} hover>
                {Object.values(row as Record<string, unknown>).map(
                  (value, cellIdx) => (
                    <TableCell key={cellIdx}>
                      {String(value ?? "null")}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {metadata && (
        <Typography variant="caption" color="text.secondary">
          Всего строк: {metadata.row_count ?? data.length}
          {metadata.execution_time_ms !== undefined &&
            ` | Время выполнения: ${(metadata.execution_time_ms / 1000).toFixed(
              2
            )} сек`}
        </Typography>
      )}
    </Box>
  );
};
