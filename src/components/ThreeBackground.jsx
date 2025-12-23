import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedBackground() {
    const meshRef = useRef();

    useFrame((state) => {
        const { clock, mouse } = state;
        if (meshRef.current) {
            // Interactive movement
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.2, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.2, 0.1);
        }
    });

    return (
        <group>
            {/* LARGE MESH SPHERE */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef} scale={1.5}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <MeshDistortMaterial
                        color="#4b2b7f"
                        speed={1}
                        distort={0.4}
                        radius={1}
                        wireframe
                        opacity={0.15}
                        transparent
                    />
                </mesh>
            </Float>

            {/* SECONDARY BLOB */}
            <Float speed={3} rotationIntensity={1} floatIntensity={1}>
                <mesh position={[-2, -1, -2]} scale={0.7}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <MeshDistortMaterial
                        color="#pink"
                        speed={2}
                        distort={0.5}
                        radius={1}
                        opacity={0.1}
                        transparent
                    />
                </mesh>
            </Float>
        </group>
    );
}

const ThreeBackgroundScene = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <AnimatedBackground />
            </Canvas>
        </div>
    );
};

export default ThreeBackgroundScene;
