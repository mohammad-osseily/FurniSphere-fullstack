"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Box, Button, Slider, Typography } from "@mui/material";
import {
  fetchAll3DProducts,
  update3DProductPosition,
} from "../services/product3dServices";
import { useRouter } from "next/navigation";

type ModelObject = {
  id: number;
  name: string;
  model: THREE.Object3D;
  position: [number, number, number];
  scale: [number, number, number];
};

export default function ThreeDManipulation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelObjects, setModelObjects] = useState<ModelObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [tempPosition, setTempPosition] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);

  const router = useRouter();

  const initializeScene = () => {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color("white");

    const newCamera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth * 0.7) / window.innerHeight,
      0.1,
      1000
    );
    newCamera.position.set(0, 10, 20);

    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.innerHTML = "";
      mountRef.current.appendChild(newRenderer.domElement);
    }

    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.25;
    newControls.enableZoom = true;

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: "gray",
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    newScene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(10, 10, 10);
    newScene.add(pointLight);

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);

    return { newScene, newCamera, newRenderer, newControls };
  };

  const loadModels = async (newScene: THREE.Scene) => {
    try {
      const products3D = await fetchAll3DProducts();
      const newModelObjects: ModelObject[] = [];

      for (const product of products3D) {
        const model = await loadModel(
          product.id,
          product.model_file_path,
          `/models/${product.model_file_path}.glb`,
          [product.position.x, product.position.z, product.position.y],
          [product.scale.x, product.scale.y, product.scale.z],
          newScene
        );
        if (model) {
          newModelObjects.push(model);
        }
      }

      setModelObjects(newModelObjects);
    } catch (error) {
      console.error("Error fetching 3D models:", error);
    }
  };

  const loadModel = (
    id: number,
    name: string,
    url: string,
    position: [number, number, number],
    scale: [number, number, number],
    newScene: THREE.Scene
  ): Promise<ModelObject | null> => {
    return new Promise((resolve) => {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(position[0], position[1], position[2]);
          model.scale.set(scale[0], scale[1], scale[2]);
          newScene.add(model);
          resolve({ id, name, model, position, scale });
        },
        undefined,
        (error) => {
          console.error(`Error loading model: ${url}`, error);
          resolve(null);
        }
      );
    });
  };

  useEffect(() => {
    const { newScene, newCamera, newRenderer, newControls } = initializeScene();

    const animate = () => {
      requestAnimationFrame(animate);
      newControls.update();
      newRenderer.render(newScene, newCamera);
    };
    animate();

    const handleResize = () => {
      newCamera.aspect = (window.innerWidth * 0.7) / window.innerHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    loadModels(newScene);

    return () => {
      window.removeEventListener("resize", handleResize);
      newScene.clear();
    };
  }, []);

  const handleObjectSelect = (name: string) => {
    setSelectedObject(name);
    const object = modelObjects.find((obj) => obj.name === name);
    if (object) {
      setTempPosition({
        x: Number(object.position[0]),
        y: Number(object.position[2]),
        z: Number(object.position[1]),
      });
    }
  };

  const handleTempPositionChange = (axis: "x" | "y" | "z", value: number) => {
    if (typeof value === "number") {
      setTempPosition((prev) => ({ ...prev, [axis]: value }));
    }
  };

  const handleSubmit = async () => {
    const object = modelObjects.find((obj) => obj.name === selectedObject);
    if (object && scene) {
      object.model.position.set(tempPosition.x, tempPosition.z, tempPosition.y);
      object.position = [tempPosition.x, tempPosition.z, tempPosition.y];

      const position = {
        x: tempPosition.x,
        y: tempPosition.y,
        z: tempPosition.z,
      };

      try {
        await update3DProductPosition(object.id, position);
        console.log("Position updated successfully");
        router.refresh();
      } catch (error) {
        console.error("Error updating position:", error);
      }

      setModelObjects([...modelObjects]);
    }
  };

  return (
    <div className="flex h-screen">
      <div ref={mountRef} className="w-[70%] h-full" />
      <div className="w-[30%] p-4 bg-gray-100 overflow-y-auto">
        <Typography variant="h6" gutterBottom>
          Object Manipulation
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {modelObjects.map((obj) => (
            <Button
              className={
                selectedObject === obj.name
                  ? "bg-primary"
                  : "text-primary border-primary"
              }
              key={obj.id}
              variant={selectedObject === obj.name ? "contained" : "outlined"}
              onClick={() => handleObjectSelect(obj.name)}
              size="small"
            >
              {obj.name}
            </Button>
          ))}
        </Box>
        {selectedObject && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedObject}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>
                X Position: {tempPosition.x.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Slider
                  className="text-primary"
                  value={tempPosition.x}
                  onChange={(_, value) =>
                    handleTempPositionChange("x", value as number)
                  }
                  min={-8}
                  max={8}
                  step={0.1}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Typography
                  variant="body2"
                  sx={{ minWidth: "40px", textAlign: "right" }}
                >
                  {tempPosition.x.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>
                Y Position: {tempPosition.y.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Slider
                  className="text-primary"
                  value={tempPosition.y}
                  onChange={(_, value) =>
                    handleTempPositionChange("y", value as number)
                  }
                  min={-8}
                  max={8}
                  step={0.1}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Typography
                  variant="body2"
                  sx={{ minWidth: "40px", textAlign: "right" }}
                >
                  {tempPosition.y.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>
                Z Position: {tempPosition.z.toFixed(2)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Slider
                  className="text-primary"
                  value={tempPosition.z}
                  onChange={(_, value) =>
                    handleTempPositionChange("z", value as number)
                  }
                  min={0}
                  max={10}
                  step={0.1}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Typography
                  variant="body2"
                  sx={{ minWidth: "40px", textAlign: "right" }}
                >
                  {tempPosition.z.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Button
              className="bg-primary"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              Apply Changes
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
}
