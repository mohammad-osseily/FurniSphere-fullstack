'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FaMicrophone } from 'react-icons/fa';
import { fetchAll3DProducts } from "../services/product3dServices";
import { useRouter } from "next/navigation";
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
  const [modelObjects, setModelObjects] = useState<{ name: string, model: THREE.Object3D }[]>([]);
  const router = useRouter();

  const [staticPositions, setStaticPositions] = useState<{ [key: string]: [number, number, number] }>({
    'chair': [0, 0, -8],
    'sesk': [2, 0, -5],
    'sofa': [4, 0, 6],
    'desk': [-4, 0, -7],
    'Modern Chair': [6, 0, -4],
    'table': [0, 0, 0],
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

  const loadModels = useCallback(async (scene: THREE.Scene) => {
    try {
      const products3D = await fetchAll3DProducts();
      const gltfLoader = new GLTFLoader();

      products3D.forEach(product => {
        const position = staticPositions[product.model_file_path] || [0, 0, 0];
        const url = `/models/${product.model_file_path}.glb`;

        gltfLoader.load(url, (gltf) => {
          const model = gltf.scene;
          model.position.set(position[0], position[1], position[2]);
          model.scale.set(3, 3, 3);
          scene.add(model);
          setModelObjects(prev => [...prev, { name: product.name, model }]);
        });
      });
    } catch (error) {
      console.error("Error loading 3D models:", error);
    }
  }, [staticPositions]);

  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 400, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 'gray', side: THREE.DoubleSide });
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
    console.log(`Movement triggered for object: ${objectName}, direction: ${direction}`);
    
    const movementUnit = 5;
    
    const objectKey = Object.keys(staticPositions).find(key => key.toLowerCase() === objectName.toLowerCase());
    console.log("Object key:", objectKey);
    
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
    
    setStaticPositions(prev => ({
      ...prev,
      [objectKey]: [x, y, z]
    }));
    console.log(`Position after change: x=${x}, y=${y}, z=${z}`);
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
      const response = await axios.post('http://127.0.0.1:8000/api/chat', { message: chatPrompt });
      const aiResponse = response.data.response;

      setChatResponse(aiResponse);
      setInteractionLog((prev) => [...prev, `You: ${currentInput}`, `AI: ${aiResponse}`]);

      console.log("Model Objects:", modelObjects);

      const objectMatch = aiResponse.match(/(chair|desk|sofa|table)/i);
      const directionMatch = aiResponse.match(/(up|down|left|right)/i);

      if (objectMatch && directionMatch) {
        const objectName = objectMatch[1];
        const direction = directionMatch[1];

        console.log("Object Name to Match:", objectName);

        parseMovement(objectName, direction);
      } else {
        console.warn("Could not understand AI response or find matching object/direction.");
      }

      setChatInput('');
    } catch (error) {
      console.error('Error submitting chat:', error);
      setChatResponse('Error communicating with the server.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div ref={mountRef} style={{ flex: 1, borderRight: '2px solid #e0e0e0' }} />

      <div style={{ width: '400px', padding: '20px', backgroundColor: '#f9f9f9', borderLeft: '2px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '15px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Chat with AI</h3>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            {interactionLog.map((log, index) => (
              <p key={index} style={{ marginBottom: '8px', padding: '8px', borderRadius: '4px', backgroundColor: log.startsWith('You:') ? '#e3f2fd' : '#e8f5e9' }}>
              {log}
            </p>
            ))}
          </div>
        </div>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask ChatGPT"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            marginBottom: '15px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            outline: 'none',
            boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <button
            onClick={() => handleChatSubmit()}
            style={{
              flex: 1,
              
              fontSize: '16px',
              
              marginRight: '10px',
              backgroundColor: '#054C73',
              color: '#fff',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
            }}
          >
            Submit
          </button>

          <div
            onMouseDown={startVoiceRecognition}
            onMouseUp={stopVoiceRecognition}
            style={{
              backgroundColor: isRecording ? '#FF5722' : '#054C73',
              borderRadius: '50%',
              height: '40px',
              width: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              animation: isRecording ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            <FaMicrophone
              style={{
                color: '#fff',
                fontSize: '20px',
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 15px 10px rgba(255, 87, 34, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 87, 34, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default ThreeScene;
