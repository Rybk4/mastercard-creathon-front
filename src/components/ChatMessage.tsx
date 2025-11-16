import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import type { ChatMessage as ChatMessageType } from "../hooks/useChatHistory";
import { TableView } from "./TableView";
import { ChartView } from "./ChartView";

import logo from "@/assets/logo.svg";

interface ChatMessageProps {
  message: ChatMessageType;
  loading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  loading = false,
}) => {
  const isUser = message.type === "user";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: "secondary.main",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "25px",
              width: "auto",
              color: "common.black",
            }}
          />
        </Avatar>
      )}
      <Paper
        sx={{
          display: "flex",
          textAlign: "left",
          p: 2,
          maxWidth:
            !isUser &&
            (message.contentType === "table" || message.contentType === "chart")
              ? "95%"
              : "70%",
          width:
            !isUser &&
            (message.contentType === "table" || message.contentType === "chart")
              ? "100%"
              : "auto",
          bgcolor: isUser
            ? "primary.main"
            : message.contentType === "error"
            ? "error.light"
            : "background.paper",
          color: isUser
            ? "primary.contrastText"
            : message.contentType === "error"
            ? "error.dark"
            : "text.primary",
          border:
            !isUser && message.contentType === "error" ? "1px solid" : "none",
          borderColor:
            !isUser && message.contentType === "error"
              ? "error.main"
              : "transparent",

          position: "relative",
          ...(!isUser && {
            "&::before": {
              content: '""',
              position: "absolute",
              left: "-7px",
              top: "10px",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: (theme) =>
                message.contentType === "error"
                  ? `8px solid ${theme.palette.error.light}`
                  : `8px solid ${theme.palette.background.paper}`,
            },
          }),

          ...(isUser && {
            "&::before": {
              content: '""',
              position: "absolute",
              right: "-7px",
              top: "10px",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderLeft: (theme) => `8px solid ${theme.palette.primary.main}`,
            },
          }),
        }}
      >
        {isUser ? (
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {message.content}
          </Typography>
        ) : (
          <Box sx={{ width: "100%", minWidth: 0 }}>
            {loading && (
              <Box sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                <CircularProgress size={16} />
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    margin: "0 0 8px 0",
                    opacity: 0.7,
                    fontStyle: "italic",
                  }}
                >
                  Обработка...
                </Typography>
              </Box>
            )}

            {message.contentType === "table" && message.data && (
              <TableView
                title={message.content}
                data={message.data}
                metadata={message.metadata}
              />
            )}

            {message.contentType === "chart" && message.data && (
              <ChartView
                title={message.content}
                data={message.data}
                metadata={message.metadata}
              />
            )}

            {message.contentType === "error" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  color: "error.main",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    margin: 0,
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  {message.content}
                </Typography>
              </Box>
            )}

            {(message.contentType === "text" || !message.contentType) && (
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  margin: 0,
                  wordBreak: "break-word",
                }}
              >
                {message.content}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
      {isUser && (
        <Avatar sx={{ bgcolor: "secondary.dark" }}>
          <PersonIcon sx={{ color: "white" }} />
        </Avatar>
      )}
    </Box>
  );
};
