import { useMemo, useState, useCallback } from "react";
import { Text, useCursor, Edges } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import GrassPatch from "../components/3D/GrassPatch";
import { type Cell as CellType } from "./GameEngine";

interface IGameCellProps {
  cell: CellType;
  position: [number, number, number];
  onReveal: () => void;
  onFlag: () => void;
  showAll: boolean;
}

export const GameCell = ({
  cell,
  position,
  onReveal,
  onFlag,
  showAll,
}: IGameCellProps) => {
  const color = useMemo(
    () =>
      cell.revealed || showAll ? (cell.value === -1 ? "#f00" : "#ddd") : "#888",
    [cell.revealed, showAll, cell.value]
  );

  const showGrass = !(cell.revealed || showAll || cell.flagged);

  const [hovered, setHovered] = useState<boolean>(false);
  useCursor(hovered, "pointer", "default");

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(false);
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onReveal();
    },
    [onReveal]
  );

  const handleContextMenu = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onFlag();
    },
    [onFlag]
  );

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color={color} />

        <Edges scale={1.001} renderOrder={2} threshold={15}>
          <meshBasicMaterial color="#1a281f" />
        </Edges>
      </mesh>

      <GrassPatch
        position={[0, 0.11, 0]}
        halfSize={0.5}
        height={0.42}
        density={150}
        visible={showGrass}
      />

      <mesh
        position={[0, 0.24, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <Text
        position={[0, 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        visible={cell.revealed && cell.value > 0}
      >
        {cell.value}
      </Text>

      <Text
        position={[0, 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        visible={cell.flagged && !cell.revealed}
      >
        dYsc
      </Text>

      <Text
        position={[0, 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        visible={showAll && cell.value === -1}
      >
        dY'?
      </Text>
    </group>
  );
};
