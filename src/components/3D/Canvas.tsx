// in Canvas.tsx
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { CameraControls, StatsGl } from "@react-three/drei";
import Cell from "./Cell";
import MapOverlay from "./MapOverlay";

export default function Canvas() {
  const GRID_SIZE = 9;
  const TILE_SIZE = 1;
  const HALF = ((GRID_SIZE - 1) * TILE_SIZE) / 2;

  const waters = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = i * TILE_SIZE - HALF;
      const z = j * TILE_SIZE - HALF;
      waters.push(<Cell key={`${i}-${j}`} position={[x, 1, z]} />);
    }
  }

  return (
    <ThreeCanvas
      className="noselect pointer-events-none h-screen w-screen bg-[#55A7A1]"
      camera={{ fov: 60, near: 0.1, far: 1_000_000 }}
      onContextMenu={() => false}
      eventSource={document.getElementById("canvas-container")!}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      gl={{ powerPreference: "high-performance", logarithmicDepthBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <MapOverlay gridSize={GRID_SIZE} tileSize={TILE_SIZE} />
      {waters}

      <CameraControls makeDefault dollyToCursor />
      <StatsGl className="absolute top-0 left-0" />
    </ThreeCanvas>
  );
}
