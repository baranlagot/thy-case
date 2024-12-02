"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from 'tesseract.js';
import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true  // Make sure to set your OpenAI API key in your environment variables
});

const DropzonePage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [menuText, setMenuText] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) {
            setError("Invalid file type. Please upload an image file.");
            return;
        }

        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
            setSelectedImage(reader.result as string);
            setError(null); // Clear any previous errors
        };

        reader.onerror = () => {
            setError("Failed to read the file. Please try again.");
        };

        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            "image/webp": [],
        },
        onDrop,
        maxFiles: 1, // Allow only one file at a time
        multiple: false,
        onDragEnter: () => { },
        onDragOver: () => { },
        onDragLeave: () => { },
    });

    const handleExtractText = async () => {
        if (!selectedImage) {
            setError("No image selected for text extraction.");
            return;
        }

        try {
            // Use Tesseract.js to extract text from the image
            const { data: { text } } = await Tesseract.recognize(selectedImage, 'eng');
            const capitalWords = text.split(/\s+/).filter(word => word === word.toUpperCase()).join(' ');
            console.log(capitalWords);

            // Use OpenAI to process the extracted text
            const result = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: `Extract the list of food items in english from the following text, then write these down seperating each indiviudal food item with an underscore. Don't add extra wording other than the answer:\n\n${capitalWords}` }
                ],
                max_tokens: 100,
            });
            console.log(result);
            const messageContent = result.choices[0]?.message?.content?.trim();

            if (messageContent) {
                const foodItems = messageContent.split('_');
                setMenuText(foodItems);
            } else {
                setError("Failed to extract text from the image.");
            }
            setError(null); // Clear any errors
        } catch (err) {
            console.error("OCR Error:", err);
            setError("Failed to extract text from the image.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Upload Menu Image</h1>

            {/* Dropzone Container */}
            <div
                {...getRootProps()}
                style={{
                    border: "2px dashed #ccc",
                    padding: "20px",
                    cursor: "pointer",
                    marginBottom: "20px",
                    backgroundColor: isDragActive ? "#f0f8ff" : "transparent",
                }}
            >
                {/* Fix: Spread getInputProps properly */}
                <input {...getInputProps()} type="file" />
                {isDragActive ? (
                    <p>Drop the image here...</p>
                ) : selectedImage ? (
                    <img
                        src={selectedImage}
                        alt="Uploaded preview"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                ) : (
                    <p>Drag & drop an image here, or click to select one.</p>
                )}
            </div>

            {/* Extract Text Button */}
            {selectedImage && (
                <button
                    onClick={handleExtractText}
                    style={{
                        backgroundColor: "#0070f3",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Extract Text from Image
                </button>
            )}

            {/* Display Extracted Text */}
            {menuText.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                    {menuText.map((item, index) => (
                        <div key={index} style={{ border: '1px solid #cccccc', borderRadius: '8px', padding: '10px', margin: '10px', width: '200px' }}>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Handling */}
            {error && (
                <div style={{ color: "red", marginTop: "20px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default DropzonePage;
