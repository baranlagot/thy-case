"use client";

import Camera from "@/components/Camera";
import ChatBox from "@/components/ChatBox";
import FoodList from "@/components/FoodList";
import { useState } from "react";

// page.tsx
export default function Home() {
  const [menuItems, setMenuItems] = useState<string[]>([]);

  const handleExtractComplete = (items: string[]) => {
    setMenuItems(items);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-500 p-4 text-white text-center">
          <h1 className="text-2xl font-semibold">Food AI Chat</h1>
        </div>
        <div className="p-4 space-y-6">
          <Camera onExtractComplete={handleExtractComplete} />
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Identified Food Items
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Tilt your device to see the cards move! Tap a food item for more
              info.
            </p>
            <FoodList items={menuItems} />
          </div>
          <ChatBox menuItems={menuItems} />
        </div>
      </div>
    </main>
  );
}
