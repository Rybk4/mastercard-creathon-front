import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HiSun, HiMoon } from "react-icons/hi";

interface ThemeSwitcherProps {
  toggleTheme: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ toggleTheme }) => {
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title={isDark ? "Светлая тема" : "Темная тема"}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "fixed",
          top: { xs: 10, sm: 16 },
          right: { xs: 10, sm: 16 },
          width: 50,
          height: 50,
          borderRadius: "50%",
          bgcolor: "background.paper",
          boxShadow: 3,
          zIndex: 1000,
          "&:hover": {
            bgcolor: "action.hover",
            transform: "scale(1.05)",
          },
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Переключить тему"
      >
        {isDark ? (
          <HiSun
            style={{
              fontSize: 25,
              color: "#FFD700",
              transition: "all 0.3s ease",
            }}
          />
        ) : (
          <HiMoon
            style={{
              fontSize: 25,
              color: "#4B5563",
              transition: "all 0.3s ease",
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSwitcher;
