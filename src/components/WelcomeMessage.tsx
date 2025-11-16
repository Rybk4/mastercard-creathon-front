import React from "react";
import { Box, Typography, keyframes } from "@mui/material";
import logo from "@/assets/logo.svg";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const WelcomeMessage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        textAlign: "center",
        gap: "16px",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          mb: "16px",
          height: "150px",
          width: "auto",
          animation: `${rotate} 15s linear infinite`,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          gap: "8px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 600, textAlign: "left" }}
        >
          Привет! Я чат бот для удобного получения данных из БД
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, textAlign: "left" }}
        >
          Вот что я могу : <br />
          Выдавать короткие ответы в виде текста <br />
          Генерировать выборки из таблицы <br />
          Рисовать графики и формировать статистику <br /> <br />
          Совет: напиши в конце запроса формат в котором хочешь увидеть ответ
          (таблица,график,текст)
        </Typography>
      </Box>
    </Box>
  );
};
