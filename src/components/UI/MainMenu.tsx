const MainMenu = ({
  onSelect,
}: {
  onSelect: (rows: number, cols: number, mines: number) => void;
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white font-mono space-y-4">
      <h1 className="text-3xl font-bold mb-6">3D Minesweeper</h1>
      <button
        className="cursor-pointer px-6 py-2 bg-green-600 rounded hover:bg-green-700"
        onClick={() => onSelect(8, 8, 10)}
      >
        Easy
      </button>
      <button
        className="cursor-pointer px-6 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
        onClick={() => onSelect(12, 12, 25)}
      >
        Medium
      </button>
      <button
        className="cursor-pointer px-6 py-2 bg-red-600 rounded hover:bg-red-700"
        onClick={() => onSelect(16, 16, 40)}
      >
        Hard
      </button>
    </div>
  );
};
export default MainMenu;
