"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
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
  // const [selectedFood, setSelectedFood] = useState<typeof mockFoodItems[0] | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      setGyroscopeSupported(true);

      const handleOrientation = (event: DeviceOrientationEvent) => {
        const beta = event.beta; // X-axis rotation
        const gamma = event.gamma; // Y-axis rotation

        if (beta !== null && gamma !== null) {
          rotateX.set(beta / 60); // Divide by 60 to limit the rotation
          rotateY.set(gamma / 60);
        }
      };

      window.addEventListener("deviceorientation", handleOrientation);

      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    }
  }, [rotateX, rotateY]);

  // const handleFoodClick = (food: typeof items[0]) => {
  //     setSelectedFood(food)
  // }

  return (
    <>
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={gyroscopeSupported ? { rotateX, rotateY } : {}}
          >
            <Card
              className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
              // /*onClick={() => handleFoodClick(item)*/}
            >
              <CardContent className="p-4">
                <motion.div
                  className="flex items-center justify-between"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-gray-800 font-medium">{item}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {/* <FoodModal
                food={selectedFood}
                isOpen={!!selectedFood}
                onClose={() => setSelectedFood(null)}
            /> */}
    </>
  );
}
