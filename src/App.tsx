import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import "./App.css";
import Dashboard from "./pages/dashboard/dashboard";

function App() {
  return (
    <Container maxWidth="lg">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Container>
  );
}

export default App;
