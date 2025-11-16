import React from "react";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  message: string;
  loading: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  loading,
  onMessageChange,
  onSubmit,
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        pb: "8px",
        alignItems: "flex-end",
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={3}
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        disabled={loading}
        placeholder="Введите ваш запрос"
        sx={{
          "& .MuiInputBase-root": {
            alignItems: "flex-start",
            maxHeight: "none",
          },
          "& textarea": {
            resize: "none",
            overflowY: "auto !important",
            maxHeight: "calc(3 * 1.5em + 14px)",
            minHeight: "1.5em",
          },
        }}
      />
      <Button
        sx={{
          height: "56px",
          minWidth: { xs: "56px", sm: "auto" },
          px: { xs: "12px", sm: "16px" },
        }}
        type="submit"
        variant="contained"
        endIcon={
          <Box sx={{ display: { xs: "none", sm: "inline-flex" } }}>
            <SendIcon />
          </Box>
        }
        disabled={loading || !message.trim()}
      >
        <Box
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
          }}
        >
          Отправить
        </Box>
        <Box
          component="span"
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SendIcon />
        </Box>
      </Button>
    </Box>
  );
};
