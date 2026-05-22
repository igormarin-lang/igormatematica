"use client";

import { RoundedBox, Text, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { safeCarColor, safeCarModel, stickerLabel } from "@/lib/studentCustomization";

type Props = {
  color?: string | null;
  model?: string | null;
  sticker?: string | null;
  isCelebrating?: boolean;
  isActive?: boolean;
};

const box = (width: number, height: number, depth: number): [number, number, number] => [width, height, depth];

function Wheel({ x, z, radius = 0.28 }: { x: number; z: number; radius?: number }) {
  return (
    <group position={[x, radius, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.24, 32]} />
        <meshStandardMaterial color="#05070a" roughness={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.126 : -0.126]}>
        <cylinderGeometry args={[radius * 0.48, radius * 0.48, 0.03, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.25} roughness={0.32} />
      </mesh>
    </group>
  );
}

function CarModel({ color, model, sticker, isCelebrating = false, isActive = true }: Props) {
  const group = useRef<Group>(null);
  const carColor = safeCarColor(color);
  const carModel = safeCarModel(model);
  const normalized = carModel === "future" ? "futuristic" : carModel === "mini" ? "turbo" : carModel;
  const dims = useMemo(() => {
    if (normalized === "formula") return { body: box(3.15, 0.36, 0.78), cabin: box(0.72, 0.42, 0.56), wheel: 0.3, spoiler: true, nose: true, kart: false, neon: false };
    if (normalized === "kart") return { body: box(1.85, 0.32, 1.02), cabin: box(0.52, 0.28, 0.48), wheel: 0.38, spoiler: false, nose: false, kart: true, neon: false };
    if (normalized === "futuristic") return { body: box(2.85, 0.48, 1.18), cabin: box(1.1, 0.58, 0.88), wheel: 0.29, spoiler: true, nose: true, kart: false, neon: true };
    if (normalized === "turbo") return { body: box(2.9, 0.52, 1.22), cabin: box(0.92, 0.54, 0.78), wheel: 0.32, spoiler: true, nose: false, kart: false, neon: false };
    return { body: box(2.65, 0.52, 1.2), cabin: box(0.95, 0.58, 0.8), wheel: 0.3, spoiler: false, nose: false, kart: false, neon: false };
  }, [normalized]);
  const wheelBase = useMemo(() => {
    if (normalized === "formula") return { x: 1.36, z: 0.68 };
    if (normalized === "kart") return { x: 0.92, z: 0.78 };
    if (normalized === "futuristic") return { x: 1.22, z: 0.76 };
    if (normalized === "turbo") return { x: 1.18, z: 0.78 };
    return { x: 1.08, z: 0.76 };
  }, [normalized]);

  useFrame(({ clock }) => {
    if (!group.current || !isActive) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = -0.5 + Math.sin(t * 0.55) * 0.08 + (isCelebrating ? Math.sin(t * 8) * 0.08 : 0);
    group.current.position.y = Math.sin(t * 1.6) * 0.025 + (isCelebrating ? Math.abs(Math.sin(t * 8)) * 0.12 : 0);
  });

  return (
    <group ref={group} rotation={[0.08, -0.5, 0]} position={[0, -0.2, 0]} scale={0.88} castShadow>
      <RoundedBox args={dims.body} radius={normalized === "formula" ? 0.18 : 0.28} smoothness={6} position={[0, 0.55, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={carColor} roughness={0.42} metalness={0.06} />
      </RoundedBox>

      {dims.nose ? (
        <RoundedBox args={[1.12, 0.25, normalized === "formula" ? 0.38 : 0.58]} radius={0.16} smoothness={5} position={[-1.72, 0.5, 0]} castShadow>
          <meshStandardMaterial color={carColor} roughness={0.42} />
        </RoundedBox>
      ) : null}

      <RoundedBox args={dims.cabin} radius={0.18} smoothness={5} position={[0.25, 1.02, 0]} castShadow>
        <meshStandardMaterial color={normalized === "futuristic" ? "#67e8f9" : "#dff7ff"} roughness={0.18} metalness={0.18} transparent opacity={0.92} />
      </RoundedBox>

      <RoundedBox args={[0.52, 0.1, 0.62]} radius={0.08} smoothness={3} position={[-0.5, 0.86, 0]} castShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </RoundedBox>
      <Text position={[-0.5, 0.925, 0.01]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} anchorX="center" anchorY="middle" color="#052e16">
        {stickerLabel(sticker)}
      </Text>

      {dims.kart ? (
        <mesh position={[0.36, 0.95, -0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.18, 0.025, 10, 24]} />
          <meshStandardMaterial color="#06130a" roughness={0.45} />
        </mesh>
      ) : null}

      {dims.spoiler ? (
        <group position={[1.46, 1.04, 0]}>
          <RoundedBox args={[0.16, 0.58, 1.25]} radius={0.05} smoothness={3} position={[0, -0.18, 0]} castShadow>
            <meshStandardMaterial color="#06130a" roughness={0.38} />
          </RoundedBox>
          <RoundedBox args={[0.24, 0.18, 1.55]} radius={0.07} smoothness={3} position={[0.12, 0.12, 0]} castShadow>
            <meshStandardMaterial color={carColor} roughness={0.36} />
          </RoundedBox>
        </group>
      ) : null}

      {normalized === "turbo" ? (
        <RoundedBox args={[0.5, 0.16, 0.44]} radius={0.08} smoothness={3} position={[-0.15, 0.9, 0]} castShadow>
          <meshStandardMaterial color="#06130a" roughness={0.5} />
        </RoundedBox>
      ) : null}

      {dims.neon ? (
        <>
          <mesh position={[0, 0.49, 0.66]}>
            <boxGeometry args={[2.1, 0.06, 0.05]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.75} />
          </mesh>
          <mesh position={[0, 0.49, -0.66]}>
            <boxGeometry args={[2.1, 0.06, 0.05]} />
            <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={0.75} />
          </mesh>
        </>
      ) : null}

      <mesh position={[-1.38, 0.58, 0.42]} castShadow>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-1.38, 0.58, -0.42]} castShadow>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color="#fde68a" emissive="#facc15" emissiveIntensity={0.4} />
      </mesh>

      <Wheel x={-wheelBase.x} z={wheelBase.z} radius={dims.wheel} />
      <Wheel x={wheelBase.x} z={wheelBase.z} radius={dims.wheel} />
      <Wheel x={-wheelBase.x} z={-wheelBase.z} radius={dims.wheel} />
      <Wheel x={wheelBase.x} z={-wheelBase.z} radius={dims.wheel} />
    </group>
  );
}

export function CarPreviewCanvas(props: Props) {
  return (
    <Canvas
      camera={{ position: [4.9, 3.05, 5.35], fov: 40 }}
      dpr={[1, 1.25]}
      frameloop={props.isActive === false ? "demand" : "always"}
      performance={{ min: 0.5 }}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 5, 4]} intensity={2.1} castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
        <spotLight position={[-3, 5, 2]} angle={0.45} penumbra={0.6} intensity={1.1} />
        <CarModel {...props} />
        <ContactShadows position={[0, -0.02, 0]} opacity={0.45} scale={6} blur={2.4} far={2.4} />
      </Suspense>
    </Canvas>
  );
}
