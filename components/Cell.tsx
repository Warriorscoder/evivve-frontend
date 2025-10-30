import React, { FC } from "react";

type CellProps = {
  char: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean; // true if player has already submitted
};

const Cell: FC<CellProps> = ({ char, isSelected, onClick, disabled }) => {
  // Disable interaction if the cell is already filled or player has submitted
  const isCellDisabled = disabled || !!char;

  let classes =
    "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl font-bold border border-gray-300 rounded-md transition-all duration-150";

  if (isSelected)
    classes += " ring-4 ring-blue-500 ring-offset-2 scale-105 z-10";

  if (isCellDisabled)
    classes += " bg-gray-100 text-gray-500 cursor-not-allowed";
  else classes += " bg-white text-gray-700 cursor-pointer hover:bg-blue-50";

  if (char) classes += " bg-gray-50 text-black";

  return (
    <button
      onClick={onClick}
      disabled={isCellDisabled}
      className={classes}
      aria-label={`Grid cell ${char || "empty"}`}
    >
      {char}
    </button>
  );
};

export default Cell;
