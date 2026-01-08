"use client";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { create3DProduct } from "../services/product3dServices";

const Add3DProduct = () => {
  const [productId, setProductId] = useState("");
  const [modelFilePath, setModelFilePath] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState({ x: 3, y: 3, z: 3 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = {
      product_id: productId,
      model_file_path: modelFilePath,
      position,
      scale,
      rotation,
    };

    try {
      await create3DProduct(formData); // Call service to create the 3D product
      setMessage("3D product added successfully!");
      setProductId("");
      setModelFilePath("");
      setPosition({ x: 0, y: 0, z: 0 });
      setScale({ x: 3, y: 3, z: 3 });
      setRotation({ x: 0, y: 0, z: 0 });
    } catch (error) {
      setMessage("Error adding 3D product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, margin: "auto", mt: 4 }}
    >
      <Typography variant="h6" gutterBottom>
        Add 3D Product
      </Typography>

      {/* Product ID */}
      <TextField
        fullWidth
        label="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        margin="normal"
        required
      />

      {/* Model File Path */}
      <TextField
        fullWidth
        label="Model File Path"
        value={modelFilePath}
        onChange={(e) => setModelFilePath(e.target.value)}
        margin="normal"
        required
      />

      {/* Position */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          fullWidth
          label="Position X"
          type="number"
          value={position.x}
          onChange={(e) =>
            setPosition({ ...position, x: parseFloat(e.target.value) })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Position Y"
          type="number"
          value={position.y}
          onChange={(e) =>
            setPosition({ ...position, y: parseFloat(e.target.value) })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Position Z"
          type="number"
          value={position.z}
          onChange={(e) =>
            setPosition({ ...position, z: parseFloat(e.target.value) })
          }
          margin="normal"
        />
      </Box>

      {/* Scale */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          fullWidth
          label="Scale X"
          type="number"
          value={scale.x}
          onChange={(e) =>
            setScale({ ...scale, x: parseFloat(e.target.value) })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Scale Y"
          type="number"
          value={scale.y}
          onChange={(e) =>
            setScale({ ...scale, y: parseFloat(e.target.value) })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Scale Z"
          type="number"
          value={scale.z}
          onChange={(e) =>
            setScale({ ...scale, z: parseFloat(e.target.value) })
          }
          margin="normal"
        />
      </Box>

      {/* Rotation */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          fullWidth
          label="Rotation X"
          type="number"
          value={rotation.x}
          onChange={(e) =>
            setRotation({ ...rotation, x: parseFloat(e.target.value) })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Rotation Y"
          type="number"
          value={rotation.y}
          onChange={(e) =>
            setRotation({ ...rotation, y: parseFloat(e.target.value) })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Rotation Z"
          type="number"
          value={rotation.z}
          onChange={(e) =>
            setRotation({ ...rotation, z: parseFloat(e.target.value) })
          }
          margin="normal"
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        className="bg-primary"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 3 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Add 3D Product"}
      </Button>

      {message && (
        <Typography
          color={message.includes("Error") ? "error" : "success"}
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Add3DProduct;
