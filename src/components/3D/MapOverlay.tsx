import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import mapPng from "../../assets/bg.png"; // adjust the relative path

const MapOverlay = ({
  gridSize,
  tileSize,
}: {
  gridSize: number;
  tileSize: number;
}) => {
  // load the texture
  const texture = useLoader(TextureLoader, mapPng);

  // compute total width of your grid
  const size = gridSize * tileSize * 3;
  const aspect = texture.image.width / texture.image.height;
  const planeWidth = size;
  const planeHeight = size / aspect;

  return (
    <mesh renderOrder={1} rotation-x={-Math.PI / 2} position={[0, 1.01, 0]}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial
        map={texture}
        transparent={true} // we still need transparency on
        alphaTest={0.5} // discard any texel with α < 0.5
        depthTest={false} // keep drawing on top
        depthWrite={false} // don’t write to the depth buffer if you’re overlaying
      />
    </mesh>
  );
};
export default MapOverlay;
