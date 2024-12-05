"use client";

import Camera from "@/components/Camera";
import ChatBox from "@/components/ChatBox";
import FoodList from "@/components/FoodList";
import { useState } from "react";
import Image from 'next/image';

// page.tsx
export default function Home() {
  const [menuItems, setMenuItems] = useState<string[]>([]);

  const handleExtractComplete = (items: string[]) => {
    setMenuItems(items);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-red-600 p-4 text-white">
          <div className="flex items-center w-full">
            <Image 
              src="/thy.png" 
              alt="Logo" 
              width={64} 
              height={64}
            />
            <h1 className="text-2xl font-semibold flex-1 text-center">Upload Menu</h1>
            <div className="w-[64px]"></div> {/* Spacer to balance the logo */}
          </div>
        </div>
        <div className="p-4 space-y-6">
          <Camera onExtractComplete={handleExtractComplete} />
          <div>
            <FoodList items={menuItems} />
          </div>
          {menuItems.length > 0 && <ChatBox menuItems={menuItems} />}
        </div>
      </div>
    </main>
  );
}
