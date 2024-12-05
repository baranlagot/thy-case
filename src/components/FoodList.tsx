"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { FoodModal } from "./FoodModal";

interface FoodListProps {
  items: string[];
}

export default function FoodList({ items }: FoodListProps) {
  const [gyroscopeSupported, setGyroscopeSupported] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setGyroscopeSupported(true);

      const handleOrientation = (event: DeviceOrientationEvent) => {
        const beta = event.beta;
        const gamma = event.gamma;

        if (beta !== null && gamma !== null) {
          rotateX.set(beta / 10);
          rotateY.set(gamma / 10);
        }
      };

      window.addEventListener("deviceorientation", handleOrientation);
      return () =>
        window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  const handleFoodClick = (food: string) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            style={{
              rotateX: gyroscopeSupported ? rotateX : 0,
              rotateY: gyroscopeSupported ? rotateY : 0,
            }}
            onClick={() => handleFoodClick(item)}
          >
            <Card className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-4 flex items-center justify-between">
                <span>{item}</span>
                <ChevronRight className="h-4 w-4" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <FoodModal
        foodName={selectedFood}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
