// three-extensions.d.ts

declare module "three/examples/jsm/controls/OrbitControls" {
  import { Camera, EventDispatcher, Vector3, MOUSE, TOUCH } from "three";

  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement);

    enabled: boolean;
    target: Vector3;

    minDistance: number;
    maxDistance: number;

    minZoom: number;
    maxZoom: number;

    enableDamping: boolean;
    dampingFactor: number;

    enableZoom: boolean;
    zoomSpeed: number;

    enableRotate: boolean;
    rotateSpeed: number;

    enablePan: boolean;
    panSpeed: number;

    screenSpacePanning: boolean;

    keyPanSpeed: number;

    autoRotate: boolean;
    autoRotateSpeed: number;

    minPolarAngle: number;
    maxPolarAngle: number;

    minAzimuthAngle: number;
    maxAzimuthAngle: number;

    enableKeys: boolean;
    keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number };

    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };

    touches: { ONE: TOUCH; TWO: TOUCH };

    update(): void;
    saveState(): void;
    reset(): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader, LoadingManager, Group } from "three";

  export class GLTFLoader extends Loader {
    constructor(manager?: LoadingManager);

    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;

    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void
    ): void;
  }

  export interface GLTF {
    scene: Group;
    scenes: Group[];
    animations: any[];
    cameras: any[];
    asset: any;
  }
}
declare module "three/examples/jsm/loaders/OBJLoader" {
  import { Loader, Object3D } from "three";

  export class OBJLoader extends Loader {
    constructor();
    load(
      url: string,
      onLoad: (object: Object3D) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: ArrayBuffer | string): Object3D;
  }
}
// GLTFLoader for .gltf/.glb
declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader, Object3D } from "three";

  export class GLTFLoader extends Loader {
    load(
      url: string,
      onLoad: (gltf: { scene: Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: ArrayBuffer | string, path: string): Object3D;
  }
}

// OBJLoader for .obj
declare module "three/examples/jsm/loaders/OBJLoader" {
  import { Loader, Object3D } from "three";

  export class OBJLoader extends Loader {
    load(
      url: string,
      onLoad: (object: Object3D) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: ArrayBuffer | string): Object3D;
  }
}

// FBXLoader for .fbx
declare module "three/examples/jsm/loaders/FBXLoader" {
  import { Loader, Object3D } from "three";

  export class FBXLoader extends Loader {
    load(
      url: string,
      onLoad: (object: Object3D) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: ArrayBuffer | string): Object3D;
  }
}

// ColladaLoader for .dae
declare module "three/examples/jsm/loaders/ColladaLoader" {
  import { Loader, Object3D } from "three";

  export class ColladaLoader extends Loader {
    load(
      url: string,
      onLoad: (collada: { scene: Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: ArrayBuffer | string): Object3D;
  }
}

// Blender for .blend (Requires Blender export to .gltf/.obj)
declare module "three/examples/jsm/loaders/GLTFLoader" {
  import { Loader, Object3D } from "three";

  export class GLTFLoader extends Loader {
    load(
      url: string,
      onLoad: (gltf: { scene: Object3D }) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    parse(data: ArrayBuffer | string, path: string): Object3D;
  }
}
