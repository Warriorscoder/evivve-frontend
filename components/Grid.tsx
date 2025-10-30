import React, { FC } from "react";
import Cell from "./Cell";

type CellData = { char: string; userId: string | null };
type GridState = CellData[];

type GridProps = {
  grid: GridState;
  selectedCell: number | null;
  onCellClick: (index: number) => void;
  hasSubmitted: boolean;
};

const Grid: FC<GridProps> = ({
  grid,
  selectedCell,
  onCellClick,
  hasSubmitted,
}) => {
  if (!Array.isArray(grid)) {
    console.error("❌ Grid is not an array:", grid);
    return <div className="text-red-500">Grid data invalid</div>;
  }

  return (
    <div className="grid grid-cols-10 gap-1.5 p-4 bg-gray-200 rounded-lg shadow-inner">
      {grid.map((cell, index) => (
        <Cell
          key={index}
          char={cell.char}
          isSelected={selectedCell === index}
          onClick={() => onCellClick(index)}
          disabled={hasSubmitted}
        />
      ))}
    </div>
  );
};


export default Grid;
