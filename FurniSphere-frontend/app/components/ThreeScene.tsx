'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FaMicrophone } from 'react-icons/fa';
import { fetchAll3DProducts } from '../services/product3dServices';
import { useRouter } from 'next/navigation';
import axios from 'axios';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [interactionLog, setInteractionLog] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [modelObjects, setModelObjects] = useState<
    { name: string; key: string; model: THREE.Object3D }[]
  >([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [manualPosition, setManualPosition] = useState<{
    x: number;
    y: number;
    z: number;
  }>({
    x: 0,
    y: 0,
    z: 0,
  });
  const router = useRouter();

  const [staticPositions, setStaticPositions] = useState<{
    [key: string]: [number, number, number];
  }>({
    chair: [0, 0, -8],
    sesk: [2, 0, -5],
    sofa: [4, 0, 6],
    desk: [-4, 0, -7],
    'Modern Chair': [6, 0, -4],
    table: [0, 0, 0],
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;

  const startVoiceRecognition = () => {
    setIsRecording(true);
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    setIsRecording(false);
    recognition.stop();
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    setChatInput(transcript);
    handleChatSubmit(transcript);
  };

  recognition.onerror = (event: any) => {
    console.error('Speech Recognition Error:', event.error);
  };

  const sanitizePosition = (pos: [number, number, number]) => {
    const [x, y, z] = pos;
    return [x, Math.max(0, y), z] as [number, number, number];
  };

  const loadModels = useCallback(
    async (scene: THREE.Scene) => {
      try {
        const products3D = await fetchAll3DProducts();
        const gltfLoader = new GLTFLoader();

        setModelObjects([]);
        const seenKeys = new Set<string>();

        products3D.forEach((product) => {
          const key =
            (product.id ? `model-${product.id}` : null) ||
            product.model_file_path ||
            product.name ||
            `model-${Date.now()}`;
          if (seenKeys.has(key)) return;
          seenKeys.add(key);
          const displayName =
            (product.name ? `${product.name}` : product.model_file_path) ||
            'Model';
          const positionFromApi = product.position
            ? sanitizePosition([
                product.position.x,
                product.position.y,
                product.position.z,
              ])
            : [0, 0, 0];
          const position = sanitizePosition(
            staticPositions[key] || positionFromApi || [0, 0, 0]
          );
          const url = `/models/${product.model_file_path}.glb`;

          gltfLoader.load(url, (gltf) => {
            const model = gltf.scene;
            model.position.set(position[0], position[1], position[2]);
            model.scale.set(3, 3, 3);
            scene.add(model);
            setModelObjects((prev) => [
              ...prev,
              { name: displayName, key, model },
            ]);
            setStaticPositions((prev) =>
              prev[key]
                ? prev
                : { ...prev, [key]: position as [number, number, number] }
            );
          });
        });
      } catch (error) {
        console.error('Error loading 3D models:', error);
      }
    },
    [staticPositions]
  );

  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 400, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 'gray',
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    loadModels(scene);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
    };
  }, [loadModels]);

  useEffect(() => {
    const cleanup = initScene();
    return () => {
      cleanup?.();
    };
  }, [initScene]);

  const reloadScene = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.clear();
      setModelObjects([]);
      loadModels(sceneRef.current);
    }
  }, [loadModels]);

  const parseMovement = (objectName: string, direction: string) => {
    console.log(
      `Movement triggered for object: ${objectName}, direction: ${direction}`
    );

    const movementUnit = 5;

    const objectKey = Object.keys(staticPositions).find(
      (key) => key.toLowerCase() === objectName.toLowerCase()
    );
    console.log('Object key:', objectKey);

    if (!objectKey) {
      console.error(`Object ${objectName} not found in staticPositions`);
      return;
    }

    let [x, y, z] = staticPositions[objectKey];
    console.log(`Position before change: x=${x}, y=${y}, z=${z}`);

    switch (direction.toLowerCase()) {
      case 'up':
        z -= movementUnit;
        break;
      case 'down':
        z += movementUnit;
        break;
      case 'left':
        x -= movementUnit;
        break;
      case 'right':
        x += movementUnit;
        break;
      default:
        console.error('Unknown direction:', direction);
        return;
    }

    setStaticPositions((prev) => ({
      ...prev,
      [objectKey]: [x, y, z],
    }));
    const target = modelObjects.find(
      (m) =>
        m.key && objectKey && m.key.toLowerCase() === objectKey.toLowerCase()
    );
    if (target) {
      target.model.position.set(x, y, z);
    }
    console.log(`Position after change: x=${x}, y=${y}, z=${z}`);
  };

  const handleSelectModel = (key: string) => {
    setSelectedModel(key);
    const base = Object.keys(staticPositions).find(
      (k) => k.toLowerCase() === key.toLowerCase()
    );
    const pos = base ? staticPositions[base] : [0, 0, 0];
    setManualPosition({ x: pos[0], y: pos[1], z: pos[2] });
  };

  const applyManualPosition = () => {
    if (!selectedModel) return;
    const key =
      Object.keys(staticPositions).find(
        (k) => k.toLowerCase() === selectedModel.toLowerCase()
      ) || selectedModel;
    const { x, y, z } = manualPosition;
    setStaticPositions((prev) => ({ ...prev, [key]: [x, y, z] }));
    const target = modelObjects.find(
      (m) => m.key && key && m.key.toLowerCase() === key.toLowerCase()
    );
    if (target) {
      target.model.position.set(x, y, z);
    }
  };

  const updateManualPosition = (axis: 'x' | 'y' | 'z', value: number) => {
    setManualPosition((prev) => {
      const next = { ...prev, [axis]: value };
      if (selectedModel) {
        const key =
          Object.keys(staticPositions).find(
            (k) => k.toLowerCase() === selectedModel.toLowerCase()
          ) || selectedModel;
        const target = modelObjects.find(
          (m) => m.key && key && m.key.toLowerCase() === key.toLowerCase()
        );
        if (target) {
          target.model.position.set(
            axis === 'x' ? value : next.x,
            axis === 'y' ? value : next.y,
            axis === 'z' ? value : next.z
          );
        }
      }
      return next;
    });
  };

  const handleChatSubmit = async (inputValue?: string) => {
    const currentInput = inputValue || chatInput;
    if (!currentInput.trim()) {
      return;
    }

    const chatPrompt = `You are controlling a 3D scene with objects like chair, desk, sofa, table. 
    Your job is to interpret the user's commands to move these objects in 3D space. 
    The user asked: "${currentInput}".`;

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chat', {
        message: chatPrompt,
      });
      const aiResponse = response.data.response;

      setChatResponse(aiResponse);
      setInteractionLog((prev) => [
        ...prev,
        `You: ${currentInput}`,
        `AI: ${aiResponse}`,
      ]);

      console.log('Model Objects:', modelObjects);

      const objectMatch = aiResponse.match(/(chair|desk|sofa|table)/i);
      const directionMatch = aiResponse.match(/(up|down|left|right)/i);

      if (objectMatch && directionMatch) {
        const objectName = objectMatch[1];
        const direction = directionMatch[1];

        console.log('Object Name to Match:', objectName);

        parseMovement(objectName, direction);
      } else {
        console.warn(
          'Could not understand AI response or find matching object/direction.'
        );
      }

      setChatInput('');
    } catch (error) {
      console.error('Error submitting chat:', error);
      setChatResponse('Error communicating with the server.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div ref={mountRef} className="flex-1 border-r border-gray-200" />

      <div className="w-[420px] p-5 flex flex-col gap-4 bg-white shadow-inner">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Chat with AI
            </h3>
            <span className="text-xs text-gray-500">
              If AI is offline, use manual controls below
            </span>
          </div>
          <div className="mt-3 h-48 overflow-y-auto rounded-md border border-gray-200 bg-white p-3">
            <div className="space-y-2 text-sm">
              {interactionLog.map((log, index) => (
                <p
                  key={index}
                  className={`rounded px-2 py-1 ${
                    log.startsWith('You:')
                      ? 'bg-blue-50 text-blue-900'
                      : 'bg-emerald-50 text-emerald-900'
                  }`}
                >
                  {log}
                </p>
              ))}
              {interactionLog.length === 0 && (
                <p className="text-gray-500">No messages yet.</p>
              )}
            </div>
          </div>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask to move a chair left, right..."
            className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => handleChatSubmit()}
              className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm"
            >
              Submit
            </button>
            <div
              onMouseDown={startVoiceRecognition}
              onMouseUp={stopVoiceRecognition}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm cursor-pointer ${
                isRecording ? 'bg-orange-500 animate-pulse' : 'bg-primary'
              }`}
            >
              <FaMicrophone className="text-white" />
            </div>
          </div>
          {chatResponse && (
            <p className="mt-2 text-xs text-gray-600">AI: {chatResponse}</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">
              Manual controls
            </h4>
            <span className="text-xs text-gray-500">
              Use if AI is unavailable
            </span>
          </div>
          <div className="mb-3 grid gap-2">
            {modelObjects.map((obj) =>
              // guard against missing names
              (() => {
                const displayName = obj.name || 'Model';
                const tag = (obj.key || obj.name || 'model').toLowerCase();
                const selectionKey = obj.key || displayName;
                return (
                  <button
                    key={selectionKey}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                      selectedModel === selectionKey
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 bg-white text-gray-800'
                    }`}
                    onClick={() => handleSelectModel(selectionKey)}
                  >
                    <span>{displayName}</span>
                    <span className="text-[11px] text-gray-500">#{tag}</span>
                  </button>
                );
              })()
            )}
            {modelObjects.length === 0 && (
              <p className="text-xs text-gray-500">No models loaded yet.</p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                <span>X Position</span>
                <span>{manualPosition.x.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={manualPosition.x}
                onChange={(e) =>
                  updateManualPosition('x', Number(e.target.value))
                }
                className="w-full accent-primary"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                <span>Y Position</span>
                <span>{manualPosition.y.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={manualPosition.y}
                onChange={(e) =>
                  updateManualPosition('y', Number(e.target.value))
                }
                className="w-full accent-primary"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-gray-700 mb-1">
                <span>Z Position</span>
                <span>{manualPosition.z.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={manualPosition.z}
                onChange={(e) =>
                  updateManualPosition('z', Number(e.target.value))
                }
                className="w-full accent-primary"
              />
            </div>
            <button
              onClick={applyManualPosition}
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              disabled={!selectedModel}
            >
              {selectedModel
                ? `Apply to ${selectedModel}`
                : 'Select a model first'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;
