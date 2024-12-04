import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodModalProps {
  food: {
    name: string;
    description: string;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FoodModal({ food, isOpen, onClose }: FoodModalProps) {
  if (!food) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{food.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-2 max-h-[60vh]">
          <DialogDescription className="text-sm text-gray-500 mb-4">
            {food.description}
          </DialogDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              Nutrition Information
            </h3>
            <p>Calories: {food.nutrition.calories} kcal</p>
            <p>Protein: {food.nutrition.protein}g</p>
            <p>Carbohydrates: {food.nutrition.carbs}g</p>
            <p>Fat: {food.nutrition.fat}g</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
