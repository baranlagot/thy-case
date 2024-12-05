"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { FoodModal } from "./FoodModal";

interface FoodListProps {
  items: string[];
}

export default function FoodList({ items }: FoodListProps) {
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFoodClick = (food: string) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div key={index} onClick={() => handleFoodClick(item)}>
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
