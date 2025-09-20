import { useMemo, useState } from "react";
import { Text, useCursor } from "@react-three/drei";
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

  const [hovered, setHovered] = useState<boolean>(false);
  useCursor(hovered, "pointer", "default");

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onReveal();
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        onFlag();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color={color} />

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
        🚩
      </Text>

      <Text
        position={[0, 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        visible={showAll && cell.value === -1}
      >
        💣
      </Text>
    </mesh>
  );
};
