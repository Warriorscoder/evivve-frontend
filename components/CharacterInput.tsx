import React, { useState, FC, FormEvent } from "react";

type CharacterInputProps = {
  selectedCell: number | null;
  hasSubmitted: boolean;
  onSubmit: (char: string) => void;
};

const CharacterInput: FC<CharacterInputProps> = ({
  selectedCell,
  hasSubmitted,
  onSubmit,
}) => {
  const [char, setChar] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (char && char.trim().length > 0) {
      onSubmit(char[0]);
      setChar("");
    }
  };

  if (hasSubmitted) {
    return (
      <div className="w-full max-w-md p-6 bg-gray-100 rounded-lg text-center shadow-md">
        <p className="text-lg font-medium text-gray-700">
          Thank you for submitting!
        </p>
        <p className="text-sm text-gray-500 mt-1">
          The grid will continue to update in real-time.
        </p>
      </div>
    );
  }

  if (selectedCell === null) {
    return (
      <div className="w-full max-w-md p-6 bg-gray-100 rounded-lg text-center shadow-md">
        <p className="text-lg font-medium text-gray-600">
          Select a block in the grid to update.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row gap-4 items-center"
    >
      <div className="grow w-full">
        <label
          htmlFor="char-input"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Enter any single character (e.g., A, 🚀, &amp;):
        </label>
        <input
          id="char-input"
          type="text"
          value={char}
          onChange={(e) => setChar(e.target.value)}
          maxLength={1}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-2xl text-center font-bold focus:ring-blue-500 focus:border-blue-500 text-black"
          autoFocus
          required
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Update Block
      </button>
    </form>
  );
};

export default CharacterInput;
