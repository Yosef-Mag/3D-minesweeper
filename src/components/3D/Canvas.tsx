import { useState, useRef } from "react";
import { Canvas as ThreeCanvas } from "@react-three/fiber";
import { CameraControls, Sky, StatsGl } from "@react-three/drei";
import { GameBoard, GameStateManager } from "../../engine";
import HUD from "../UI/HUD";
import MainMenu from "../UI/MainMenu";

const Canvas = () => {
  const [gameManager, setGameManager] = useState<GameStateManager | null>(null);
  const cameraControlsRef = useRef<CameraControls>(null);

  // Camera fit logic as a callback
  const fitCameraToBoard = (controls?: CameraControls) => {
    if (!gameManager || !controls) return;
    const rows = gameManager.getGrid().length;
    const cols = gameManager.getGrid()[0].length;
    const center = [rows / 2 - 0.5, 0, cols / 2 - 0.5];
    const size = Math.max(rows, cols);
    const distance = size * 2;
    const angleRad = Math.PI / 4;
    const camX = center[0] + distance * Math.sin(angleRad);
    const camY = center[1] + distance * 0.7; // slightly above
    const camZ = center[2] + distance * Math.cos(angleRad);
    controls.setLookAt(camX, camY, camZ, center[0], center[1], center[2], true);
  };

  const handleSelect = (rows: number, cols: number, mines: number) => {
    setGameManager(new GameStateManager(rows, cols, mines));
  };

  const handleMainMenu = () => {
    setGameManager(null);
  };

  return (
    <>
      {!gameManager && <MainMenu onSelect={handleSelect} />}
      {gameManager && (
        <HUD gameManager={gameManager} onMainMenu={handleMainMenu} />
      )}
      {gameManager && (
        <ThreeCanvas
          className="h-screen w-screen bg-[#F8F4EC]"
          camera={{ fov: 60, near: 0.1, far: 1_000_000 }}
          onContextMenu={() => false}
          eventSource={document.getElementById("canvas-container")!}
          onCreated={() =>
            fitCameraToBoard(cameraControlsRef.current ?? undefined)
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          gl={{
            powerPreference: "high-performance",
            logarithmicDepthBuffer: true,
          }}
        >
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <GameBoard gameManager={gameManager} />
          <CameraControls ref={cameraControlsRef} makeDefault dollyToCursor />
          {import.meta.env.DEV && (
            <StatsGl className="absolute bottom-0 left-0" />
          )}
        </ThreeCanvas>
      )}
    </>
  );
};

export default Canvas;
