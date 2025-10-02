import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GrassPatchProps {
  bladeCount?: number;
  density?: number;
  halfSize?: number;
  radius?: number;
  height?: number;
  position?: [number, number, number];
  visible?: boolean;
  color?: string;
}

type BladeData = {
  offset: THREE.Vector2;
  baseRotation: number;
  baseTilt: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  heightScale: number;
  widthScale: number;
  bendAxis: THREE.Vector2;
};

const GrassPatch = ({
  bladeCount = 1000,
  density = 160,
  halfSize,
  radius,
  height = 0.55,
  position = [0, 0, 0],
  visible = true,
  color = "#4aa366",
}: GrassPatchProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummyObject = useMemo(() => new THREE.Object3D(), []);
  const noopRaycast = useCallback(
    (_raycaster: THREE.Raycaster, _intersections: THREE.Intersection[]) =>
      undefined,
    []
  );

  const patchHalfSize = useMemo(() => {
    const value = halfSize ?? radius ?? 0.48;
    return Math.max(0.01, value);
  }, [halfSize, radius]);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(0.09, height, 4, 1);
    geom.translate(0, height / 2, 0);
    return geom;
  }, [height]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
        roughness: 0.95,
        metalness: 0.05,
        depthWrite: false,
      }),
    [color]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const targetBladeCount = useMemo(() => {
    if (typeof bladeCount === "number" && !Number.isNaN(bladeCount)) {
      return Math.max(1, Math.floor(bladeCount));
    }
    const area = Math.pow(patchHalfSize * 2, 2);
    return Math.max(1, Math.round(area * density));
  }, [bladeCount, density, patchHalfSize]);

  const blades = useMemo<BladeData[]>(() => {
    const data: BladeData[] = [];
    for (let i = 0; i < targetBladeCount; i++) {
      const offset = new THREE.Vector2(
        (Math.random() * 2 - 1) * patchHalfSize,
        (Math.random() * 2 - 1) * patchHalfSize
      );
      const baseRotation = Math.random() * Math.PI * 2;
      const baseTilt = THREE.MathUtils.degToRad(
        THREE.MathUtils.lerp(2, 12, Math.random())
      );
      const swaySpeed = THREE.MathUtils.lerp(0.6, 1.4, Math.random());
      const swayAmplitude = THREE.MathUtils.lerp(0.05, 0.18, Math.random());
      const swayOffset = Math.random() * Math.PI * 2;
      const heightScale = THREE.MathUtils.lerp(0.65, 1.15, Math.random());
      const widthScale = THREE.MathUtils.lerp(0.55, 0.95, Math.random());
      const bendAngle = Math.random() * Math.PI * 2;
      const bendAxis = new THREE.Vector2(
        Math.cos(bendAngle),
        Math.sin(bendAngle)
      );
      data.push({
        offset,
        baseRotation,
        baseTilt,
        swaySpeed,
        swayAmplitude,
        swayOffset,
        heightScale,
        widthScale,
        bendAxis,
      });
    }
    return data;
  }, [patchHalfSize, targetBladeCount]);

  const updateInstanceMatrices = useCallback(
    (time: number) => {
      const mesh = meshRef.current;
      if (!mesh) return;

      for (let i = 0; i < blades.length; i++) {
        const blade = blades[i];
        const sway =
          Math.sin(time * blade.swaySpeed + blade.swayOffset) *
          blade.swayAmplitude;
        const tilt = blade.baseTilt + sway;

        dummyObject.position.set(blade.offset.x, 0, blade.offset.y);
        dummyObject.scale.set(blade.widthScale, blade.heightScale, 1);
        dummyObject.rotation.set(
          blade.bendAxis.x * tilt,
          blade.baseRotation,
          blade.bendAxis.y * tilt
        );
        dummyObject.updateMatrix();
        mesh.setMatrixAt(i, dummyObject.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    },
    [blades, dummyObject]
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.count = blades.length;
    mesh.geometry = geometry;
    mesh.material = material;
    updateInstanceMatrices(0);
  }, [blades, geometry, material, updateInstanceMatrices]);

  useFrame(({ clock }) => {
    if (!visible) return;
    updateInstanceMatrices(clock.getElapsedTime());
  });

  return (
    <group position={position} visible={visible}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, blades.length || 1]}
        castShadow={false}
        receiveShadow={false}
        frustumCulled={false}
        raycast={noopRaycast}
      />
    </group>
  );
};

export default memo(GrassPatch);
