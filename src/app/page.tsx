"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from "tesseract.js";

const DropzonePage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [menuText, setMenuText] = useState<string>("");
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
            const result = await Tesseract.recognize(selectedImage, "eng", {
                logger: (info) => console.log(info), // Progress logs
            });
            setMenuText(result.data.text);
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
            {menuText && (
                <div style={{ marginTop: "20px", textAlign: "left" }}>
                    <h2>Extracted Menu Text:</h2>
                    <pre>{menuText}</pre>
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
