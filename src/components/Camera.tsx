"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Tesseract from "tesseract.js";

interface CameraProps {
  onExtractComplete: (items: string[]) => void;
}

export default function Camera({ onExtractComplete }: CameraProps) {
  const [photoTaken, setPhotoTaken] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

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

        const deviceLanguage = navigator.language || "en";

        // Use OpenAI to process the extracted text
        const result = await fetch("/api/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: capitalWords, language: deviceLanguage }),
        });

        const data = await result.json();
        const messageContent = data.message;

        if (messageContent) {
          const foodItems = messageContent.split("_");
          onExtractComplete(foodItems); // Pass data to parent
          setProcessing(false);
        } else {
          onExtractComplete([]);
        }
      } catch (err) {
        setPhotoTaken(false);
        setProcessing(false);
        console.error("OCR Error:", err);
        onExtractComplete([]);
      }
    }
  };

  const handleExtractText = async (image: string) => {
    if (!image) {
      setError("No image selected for text extraction.");
      return;
    }

    try {
      // Use Tesseract.js to extract text from the image
      const {
        data: { text },
      } = await Tesseract.recognize(image, "eng");
      const capitalWords = text
        .split(/\s+/)
        .filter((word) => word === word.toUpperCase())
        .join(" ");

      // Use OpenAI to process the extracted text
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: capitalWords }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const messageContent = data.message;

      if (messageContent) {
        const foodItems = messageContent.split("_");
        onExtractComplete(foodItems); // Pass data to parent
        setError(null); // Clear any errors
      } else {
        setError("Failed to extract text from the image.");
        onExtractComplete([]);
      }
    } catch (err) {
      console.error("OCR Error:", err);
      setError("Failed to extract text from the image.");
      onExtractComplete([]);
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
        className="shadow-md transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
      >
        {processing ? "Processing..." : "Take Photo"}
      </Button>
    </div>
  );
}
