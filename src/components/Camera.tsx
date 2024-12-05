"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Tesseract from "tesseract.js";
import { FaCamera } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface CameraProps {
  onExtractComplete: (items: string[]) => void;
}

export default function Camera({ onExtractComplete }: CameraProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoTaken(true);
      setProcessing(true);
      try {
        // Use Tesseract.js to extract text from the image
        const {
          data: { text },
        } = await Tesseract.recognize(file, "eng");
        const capitalWords = text
          .split(/\s+/)
          .filter((word) => word === word.toUpperCase())
          .join(" ");

        const result = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: capitalWords }),
        });

        const data = await result.json();
        const messageContent = data.message;

        if (messageContent === "!") {
          toast({
            variant: "destructive",
            title: "Extraction Failed",
            description: "Could not identify any food items in the image",
            duration: 3000,
          });
          setProcessing(false);
          setPhotoTaken(false);
          onExtractComplete([]);
        } else if (messageContent) {
          const foodItems = messageContent.split("_");
          onExtractComplete(foodItems); // Pass data to parent
          setProcessing(false);
          setPhotoTaken(false);
        } else {
          onExtractComplete([]);
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while processing the image",
          duration: 3000,
        });
        setPhotoTaken(false);
        setProcessing(false);
        onExtractComplete([]);
      }
    }
  };

  return (
    <div className="flex justify-center">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={handleTakePhoto}
        disabled={photoTaken}
        aria-label="Take Photo"
        className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
      >
        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        {processing ? (
          <BiLoader className="text-xl animate-spin" />
        ) : (
          <FaCamera className="text-xl" />
        )}
      </Button>
      <Toaster />
    </div>
  );
}
