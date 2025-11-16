import React, { useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";

export type ModelType = "api" | "llm";

export interface ModelOption {
  id: ModelType;
  name: string;
  description: string;
}

const models: ModelOption[] = [
  {
    id: "api",
    name: "GeminiAPI",
    description: "Использование Gemini API",
  },
  {
    id: "llm",
    name: "Ollama",
    description: "Использование локальной модели Ollama",
  },
];

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (modelId: ModelType) => {
    onModelChange(modelId);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          color: "text.primary",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 2,
          py: 1,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Typography variant="h6" component="span">
          {selectedModelData?.name || "GeminiAPI"}
        </Typography>
        <ArrowDropDownIcon />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxWidth: 400,
            boxShadow: 3,
          },
        }}
      >
        {models
          .map((model, index) => {
            const items = [];
            if (index > 0) {
              items.push(<Divider key={`divider-${model.id}`} />);
            }
            items.push(
              <MenuItem
                key={model.id}
                onClick={() => handleSelect(model.id)}
                sx={{
                  py: 2,
                  px: 2,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 0.5,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {model.name}
                  </Typography>
                  {selectedModel === model.id && (
                    <CheckIcon sx={{ color: "primary.main" }} />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {model.description}
                </Typography>
              </MenuItem>
            );
            return items;
          })
          .flat()}
      </Menu>
    </>
  );
};
