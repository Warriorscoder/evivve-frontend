import React, { FC } from "react";
import { Users } from "lucide-react";

type HeaderProps = { onlineCount: number };

const Header: FC<HeaderProps> = ({ onlineCount }) => (
  <header className="w-full max-w-2xl mx-auto p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-800">Real-time Grid</h1>
    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
      <Users className="w-5 h-5" />
      <span>{onlineCount} Players Online</span>
    </div>
  </header>
);

export default Header;
