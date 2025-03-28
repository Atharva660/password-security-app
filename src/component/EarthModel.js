import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function EarthModel() {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loader = new GLTFLoader();
    const controller = new AbortController();
    const signal = controller.signal;

    loader.load(
      '/earth.glb',
      (gltf) => {
        // Clean up empty nodes
        gltf.scene.traverse((node) => {
          if (node.type === 'Empty' || 
              (node.children && node.children.length === 0 && !node.geometry)) {
            node.parent.remove(node);
          }
        });
        setModel(gltf);
      },
      (xhr) => {
        setProgress((xhr.loaded / xhr.total) * 100);
      },
      (err) => {
        if (!signal.aborted) {
          setError(err.message || 'Failed to load model');
          console.error('Loader error:', err);
        }
      }
    );

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
        <text position={[0, -1.5, 0]} color="white" anchorX="center" anchorY="middle">
          {error}
        </text>
      </group>
    );
  }

  if (!model) {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#666" wireframe />
        </mesh>
        <text position={[0, -1.5, 0]} color="white" anchorX="center" anchorY="middle">
          Loading... {Math.round(progress)}%
        </text>
      </group>
    );
  }

  return <primitive object={model.scene} />;
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Suspense fallback={null}>
        <EarthModel />
        <OrbitControls />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}