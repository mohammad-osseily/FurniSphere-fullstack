'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Create3DProductPayload,
  create3DProduct,
  fetchAll3DProducts,
  delete3DProduct,
} from '../services/product3dServices';
import { fetchAllProducts } from '../services/productService';
import { Product } from '@/types/product';
import { Product3D } from '@/types';

type Add3DProductProps = {
  onCreated?: () => void;
};

const Add3DProduct = ({ onCreated }: Add3DProductProps) => {
  const [productId, setProductId] = useState('');
  const [modelFilePath, setModelFilePath] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState({ x: 3, y: 3, z: 3 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [modelFiles, setModelFiles] = useState<string[]>([]);
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [entries3D, setEntries3D] = useState<Product3D[]>([]);
  const [isFetchingEntries, setIsFetchingEntries] = useState(false);

  const usedModelBaseNames = useMemo(() => {
    return new Set(
      entries3D.map((entry) => entry.model_file_path.toLowerCase())
    );
  }, [entries3D]);

  const availableModelFiles = useMemo(() => {
    return modelFiles.filter((file) => {
      const base = file.replace(/\.glb$/i, '').toLowerCase();
      return !usedModelBaseNames.has(base);
    });
  }, [modelFiles, usedModelBaseNames]);

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }
    return [...products].sort((a, b) =>
      a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    );
  }, [products]);

  const loadProducts = async () => {
    setIsFetchingProducts(true);
    try {
      const list = await fetchAllProducts();
      setProducts(list);
    } catch (error) {
      setMessage('Failed to load products. Please refresh.');
    } finally {
      setIsFetchingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadModelFiles = async () => {
    setIsFetchingFiles(true);
    try {
      const response = await fetch('/api/models/list');
      const data = (await response.json()) as { files?: string[] };
      setModelFiles(Array.isArray(data.files) ? data.files : []);
    } catch (_error) {
      setModelFiles([]);
    } finally {
      setIsFetchingFiles(false);
    }
  };

  useEffect(() => {
    loadModelFiles();
  }, []);

  const loadEntries3D = async () => {
    setIsFetchingEntries(true);
    try {
      const list = await fetchAll3DProducts();
      setEntries3D(Array.isArray(list) ? list : []);
    } catch (_error) {
      setEntries3D([]);
    } finally {
      setIsFetchingEntries(false);
    }
  };

  useEffect(() => {
    loadEntries3D();
  }, []);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      return;
    }

    const normalizedName = file.name.trim().replace(/\s+/g, '-');
    const baseName = normalizedName.replace(/\.glb$/i, '');
    setModelFilePath(baseName);
  };

  const uploadModelToPublic = async (): Promise<string> => {
    if (!selectedFile) {
      throw new Error('Please choose a .glb file first.');
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('/api/upload-model', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Upload failed');
    }

    const data = (await response.json()) as { baseName: string };
    return data.baseName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setMessage('Please select a product.');
      return;
    }

    if (!selectedFile && !modelFilePath) {
      setMessage('Choose a .glb file or pick one from the list.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      let baseName = modelFilePath;

      if (selectedFile) {
        baseName = await uploadModelToPublic();
        setModelFilePath(baseName);
      }

      const payload: Create3DProductPayload = {
        product_id: Number(productId),
        model_file_path: baseName || modelFilePath,
        position,
        scale,
        rotation,
      };

      await create3DProduct(payload);
      setMessage('3D product added successfully!');
      setProductId('');
      setModelFilePath('');
      setPosition({ x: 0, y: 0, z: 0 });
      setScale({ x: 3, y: 3, z: 3 });
      setRotation({ x: 0, y: 0, z: 0 });
      setSelectedFile(null);
      setFileInputKey((prev) => prev + 1);
      loadModelFiles();
      loadEntries3D();
      onCreated?.();
    } catch (error) {
      setMessage('Error adding 3D product. Please try again.');
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, margin: 'auto', mt: 4 }}
    >
      <Typography variant="h6" gutterBottom>
        Add 3D Product
      </Typography>

      <Box sx={{ mt: 1, mb: 3 }}>
        <Box className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography variant="subtitle1">Available model files</Typography>
            <Typography variant="body2" color="textSecondary">
              Only unused .glb files appear here
            </Typography>
          </div>
          <Button
            size="small"
            onClick={loadModelFiles}
            disabled={isFetchingFiles}
          >
            {isFetchingFiles ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
        <Box className="mt-3 grid gap-2">
          {availableModelFiles.map((file) => (
            <div
              key={file}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-gray-900">
                  {file}
                </span>
              </div>
              <button
                className="text-xs font-semibold text-primary underline"
                onClick={() => setModelFilePath(file.replace(/\.glb$/i, ''))}
              >
                Use
              </button>
            </div>
          ))}
          {availableModelFiles.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              No available files. Upload a new .glb or delete an entry to free
              one.
            </div>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 2, mb: 3 }}>
        <Box className="flex items-center justify-between">
          <div className="flex flex-col">
            <Typography variant="subtitle1">Existing 3D entries</Typography>
            <Typography variant="body2" color="textSecondary">
              Models currently in use (removing frees the file)
            </Typography>
          </div>
          <Button
            size="small"
            onClick={loadEntries3D}
            disabled={isFetchingEntries}
          >
            {isFetchingEntries ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
        <Box className="mt-3 grid gap-2">
          {entries3D.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-900">
                  {entry.model_file_path}.glb
                </span>
                <span className="text-xs text-gray-600">
                  Product #{entry.product_id}
                </span>
              </div>
              <button
                className="text-xs font-semibold text-red-600"
                onClick={async () => {
                  try {
                    await delete3DProduct(entry.id);
                    loadEntries3D();
                    setMessage('Deleted 3D entry (file kept).');
                  } catch (err) {
                    setMessage('Failed to delete entry.');
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {entries3D.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              No 3D entries yet. Add one above to start.
            </div>
          )}
        </Box>
      </Box>

      {/* Product ID */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">Select Product</Typography>
        <Button
          size="small"
          onClick={loadProducts}
          disabled={isFetchingProducts}
        >
          Refresh
        </Button>
      </Box>
      <Select
        fullWidth
        displayEmpty
        value={productId}
        onChange={(e) => setProductId(e.target.value as string)}
        disabled={isFetchingProducts}
      >
        <MenuItem value="">
          {isFetchingProducts
            ? 'Loading products...'
            : sortedProducts.length === 0
            ? 'No products found'
            : 'Select product'}
        </MenuItem>
        {sortedProducts.map((product) => (
          <MenuItem key={product.id} value={product.id.toString()}>
            {product.name} (#{product.id})
          </MenuItem>
        ))}
      </Select>
      <TextField
        fullWidth
        label="Or enter product ID manually"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        margin="normal"
        placeholder="e.g. 1"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />

      {/* Model File */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          component="label"
          className="border-primary text-primary hover:bg-primary hover:text-white"
          fullWidth
        >
          Choose .glb file
          <input
            key={fileInputKey}
            type="file"
            accept=".glb"
            hidden
            onChange={(event) =>
              handleFileChange(
                event.target.files ? event.target.files[0] : null
              )
            }
          />
        </Button>
        {selectedFile && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected: {selectedFile.name}
          </Typography>
        )}
      </Box>

      {/* Model File Path */}
      <TextField
        fullWidth
        label="Model file path (saved as)"
        value={modelFilePath}
        onChange={(e) => setModelFilePath(e.target.value)}
        margin="normal"
        helperText="We save the file under /public/models and use this name in the DB."
        required
      />

      {/* Position */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
        disabled={isLoading || isUploading}
        sx={{ mt: 3 }}
      >
        {isLoading || isUploading ? (
          <CircularProgress size={24} />
        ) : (
          'Add 3D Product'
        )}
      </Button>

      {message && (
        <Typography
          color={message.includes('Error') ? 'error' : 'success'}
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Add3DProduct;
