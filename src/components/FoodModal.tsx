import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiRefresh } from "react-icons/bi";

interface FoodDetails {
  name: string;
  description: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface FoodModalProps {
  foodName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FoodModal({ foodName, isOpen, onClose }: FoodModalProps) {
  const [loading, setLoading] = useState(false);
  const [foodDetails, setFoodDetails] = useState<FoodDetails | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [cachedData, setCachedData] = useState<{ [key: string]: FoodDetails }>(
    {}
  );

  const fetchFoodDetails = async () => {
    if (cachedData[foodName]) {
      setFoodDetails(cachedData[foodName]);
      return;
    }

    setLoading(true);
    setFetchError(false);
    try {
      const response = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName }),
      });
      const data = await response.json();
      setFoodDetails(data);
      setCachedData((prev) => ({ ...prev, [foodName]: data }));
    } catch (error) {
      setFetchError(true);
      console.error("Failed to fetch food details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFoodDetails();
    }
  }, [isOpen, foodName]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{loading ? "" : foodDetails?.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] p-4">
          {fetchError ? (
            <div className="flex flex-col items-center p-4">
              <p className="mb-4 text-red-500">Failed to fetch food details.</p>
              <Button
                onClick={fetchFoodDetails}
                className="flex items-center justify-center"
              >
                <BiRefresh className="h-5 w-5" />
              </Button>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : foodDetails ? (
            <div className="space-y-4">
              <p>{foodDetails.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>Calories: {foodDetails.nutrition.calories}</div>
                <div>Protein: {foodDetails.nutrition.protein}g</div>
                <div>Carbs: {foodDetails.nutrition.carbs}g</div>
                <div>Fat: {foodDetails.nutrition.fat}g</div>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
