"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header";
import Grid from "./Grid";
import CharacterInput from "./CharacterInput";

type CellData = { char: string; userId: string | null };
type GridState = CellData[];

export default function Main() {
  const [grid, setGrid] = useState<GridState>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // ✅ Load/generate playerId safely (survives reload)
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    let id = localStorage.getItem("playerId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("playerId", id);
    }

    // Defer state update to next tick to avoid ESLint warning
    Promise.resolve().then(() => setUserId(id));
  }, []);

  // ✅ Setup socket once userId is ready
  useEffect(() => {
    if (!userId) return;
    console.log("url ", process.env.NEXT_PUBLIC_BACKEND_URL);
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      query: { playerId: userId },
    });
    socketRef.current = socket;

    // ✅ Initialize grid and submission state
    socket.on("init", ({ grid, onlineCount, submitted }) => {
      console.log("🟢 Socket initialized", submitted);
      setGrid(grid);
      setOnlineCount(onlineCount);
      if (submitted) {
        setHasSubmitted(true);
      }
    });

    // ✅ Lock all tabs when backend marks player as submitted
    socket.on("submission_locked", () => {
      setHasSubmitted(true);
    });

    socket.on("player_count", ({ onlineCount }) => {
      setOnlineCount(onlineCount);
    });

    socket.on("cell_update", ({ row, col, char }) => {
      setGrid((prev) => {
        const newGrid = [...prev];
        const index = row * 10 + col;
        newGrid[index] = { char, userId: null };
        return newGrid;
      });
    });

    // ✅ Optional: handle backend errors
    socket.on("error_msg", ({ message }) => {
      console.warn("⚠️ Server error:", message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  // ✅ Emit placement only if allowed; backend enforces global lock
  const handleSubmitCharacter = (char: string) => {
    if (selectedCell === null || hasSubmitted) return;
    const socket = socketRef.current;
    if (!socket) return;

    const row = Math.floor(selectedCell / 10);
    const col = selectedCell % 10;

    socket.emit("place_char", { row, col, char });
    // ❌ Don't setHasSubmitted(true) here — backend will confirm
  };

  const handleCellClick = (index: number) => {
    if (!hasSubmitted) setSelectedCell(index);
  };

  if (!userId) {
    return (
      <div className="text-center text-gray-500 p-8">
        Initializing player session...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
      <main className="flex flex-col items-center gap-8 w-full">
        <Header onlineCount={onlineCount} />
        <Grid
          grid={grid}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
          hasSubmitted={hasSubmitted}
        />
        <CharacterInput
          selectedCell={selectedCell}
          hasSubmitted={hasSubmitted}
          onSubmit={handleSubmitCharacter}
        />
      </main>
    </div>
  );
}
