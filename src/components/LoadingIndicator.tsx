import React from "react";
import {
  Box,
  Paper,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export const LoadingIndicator: React.FC = () => {
  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-start" }}>
      <Avatar sx={{ bgcolor: "primary.main" }}>
        <SmartToyIcon />
      </Avatar>
      <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Обработка запроса...
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
