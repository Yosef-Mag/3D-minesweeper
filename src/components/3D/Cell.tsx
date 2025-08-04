import * as THREE from "three";
import { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material";
import { Edges } from "@react-three/drei";
import vertexShader from "../../assets/shaders/vertex.glsl";
import fragmentShader from "../../assets/shaders/fragment.glsl";

interface CellProps {
  position?: [number, number, number];
}

const Cell: FC<CellProps> = ({ position = [0, 0, 0] }) => {
  const COLOR_BASE_NEAR = "#55A7A1";
  const COLOR_BASE_FAR = "#55A7A1";
  const WAVE_SPEED = 5.0;
  const WAVE_AMPLITUDE = 0.2;
  const TEXTURE_SIZE = 97;

  const COLOR_FAR = new THREE.Color(COLOR_BASE_FAR);
  const materialRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={position}
      onClick={() => console.log("cell click")}
    >
      <planeGeometry args={[1, 1]} />
      <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={THREE.MeshStandardMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColorFar: { value: COLOR_FAR },
          uWaveSpeed: { value: WAVE_SPEED },
          uWaveAmplitude: { value: WAVE_AMPLITUDE },
          uTextureSize: { value: TEXTURE_SIZE },
        }}
        color={COLOR_BASE_NEAR}
        transparent
      />
      <Edges scale={1.001} color="black" />
    </mesh>
  );
};
export default Cell;
