import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useChatHistory, useStreaming } from "@/hooks";
import { WelcomeMessage, ChatMessage, ChatInput } from "@/components";
import { theme } from "@/theme";
import logo from "@/assets/logo.svg";

function Dashboard() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, showWelcome, addMessage, updateMessage, clearHistory } =
    useChatHistory();
  const { loading, sendMessage } = useStreaming();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: message.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage = {
      id: assistantMessageId,
      type: "assistant" as const,
      content: "",
      timestamp: Date.now(),
    };

    addMessage(assistantMessage);
    setMessage("");

    try {
      await sendMessage(
        userMessage.content,
        (processed) => {
          updateMessage(assistantMessageId, {
            content: processed.content,
            contentType: processed.contentType,
            data: processed.data,
            metadata: processed.metadata,
          });
        },
        (errorMessage) => {
          updateMessage(assistantMessageId, {
            content: ` Ошибка: ${errorMessage}`,
            contentType: "error",
          });
        }
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла неизвестная ошибка";
      updateMessage(assistantMessageId, {
        content: ` Ошибка: ${errorMessage}`,
        contentType: "error",
      });
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при очистке истории";

      const errorMessageId = Date.now().toString();
      const errorChatMessage = {
        id: errorMessageId,
        type: "assistant" as const,
        content: `Ошибка при очистке истории: ${errorMessage}`,
        contentType: "error" as const,
        timestamp: Date.now(),
      };
      addMessage(errorChatMessage);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        m: "0 auto",
        height: "100dvh",
        p: "0px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "16px",
          borderBottom: `2px solid`,
          borderColor: theme.palette.primary.main,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: "40px",
              width: "auto",
              color: "primary.main",
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            TextQL
          </Typography>
        </Box>
        {messages.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleClearHistory}
            disabled={loading}
          >
            Новый чат
          </Button>
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          my: 2,
          bgcolor: "transparent",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 1, sm: 2 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {showWelcome && <WelcomeMessage />}

          {messages.map((msg, index) => {
            const isLastMessage = index === messages.length - 1;
            const isLoadingMessage =
              loading &&
              isLastMessage &&
              msg.type === "assistant" &&
              (!msg.content || msg.content.trim() === "");

            return (
              <ChatMessage
                key={msg.id}
                message={msg}
                loading={isLoadingMessage}
              />
            );
          })}

          <div ref={messagesEndRef} />
        </Box>
      </Paper>

      <ChatInput
        message={message}
        loading={loading}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}

export default Dashboard;
