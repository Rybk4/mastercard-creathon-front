import { StrictMode, useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.tsx";
import { lightTheme, darkTheme } from "./theme";
import ThemeSwitcher from "./components/themeSwitcher.tsx";

const THEME_STORAGE_KEY = "theme_mode";

export function AppWithTheme() { 
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedMode === "dark" ? "dark" : "light") as "light" | "dark";
  });
 
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const theme = useMemo(() => {
    return mode === "dark" ? darkTheme : lightTheme;
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeSwitcher toggleTheme={toggleTheme} />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithTheme />
    </BrowserRouter>
  </StrictMode>
);
