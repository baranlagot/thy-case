"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Tesseract from 'tesseract.js';

const DropzonePage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [menuText, setMenuText] = useState<string[]>([]);
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [userInput, setUserInput] = useState<string>('');
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
            handleExtractText(reader.result as string);
        };

        reader.onerror = () => {
            setError("Failed to read the file. Please try again.");
        };

        reader.readAsDataURL(file);
    };

    const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
                setError(null); // Clear any previous errors
                handleExtractText(reader.result as string);
            };
            reader.onerror = () => {
                setError("Failed to read the file. Please try again.");
            };
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
            "image/webp": [],
        },
        onDrop,
        onDragEnter: () => { },
        onDragOver: () => { },
        onDragLeave: () => { },
        maxFiles: 1, // Allow only one file at a time
        multiple: false,
    });

    const handleExtractText = async (image: string) => {
        if (!image) {
            setError("No image selected for text extraction.");
            return;
        }

        try {
            // Use Tesseract.js to extract text from the image
            const { data: { text } } = await Tesseract.recognize(image, 'eng');
            const capitalWords = text.split(/\s+/).filter(word => word === word.toUpperCase()).join(' ');
            console.log(capitalWords);

            // Use OpenAI to process the extracted text
            const result = await fetch('/api/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: capitalWords }),
            });

            const data = await result.json();
            const messageContent = data.message;

            if (messageContent) {
                const foodItems = messageContent.split('_');
                setMenuText(foodItems);
                setError(null); // Clear any errors
            } else {
                setError("Failed to extract text from the image.");
                setMenuText([]);
            }
        } catch (err) {
            console.error("OCR Error:", err);
            setError("Failed to extract text from the image.");
            setMenuText([]);
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessages = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');

        try {
            const result = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages,
                    menuText
                }),
            });

            const data = await result.json();
            const messageContent = data.message;

            if (messageContent) {
                setMessages([...newMessages, { role: 'assistant', content: messageContent }]);
            }
        } catch (err) {
            console.error("ChatGPT Error:", err);
        }
    };

    return (
        <div className="p-5 max-w-lg mx-auto font-sans">
            <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-5 text-center mb-5 rounded-lg bg-gray-50">
                <input {...getInputProps()} type="file" />
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
            </div>
            <div className="text-center mb-5">
                <input type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" id="cameraInput" />
                <label htmlFor="cameraInput" className="cursor-pointer text-blue-500 block mb-2">
                    <button className="w-full p-2 bg-blue-500 text-white rounded-lg">Take a photo</button>
                </label>
            </div>
            {error && <p className="text-red-500 text-center mt-5">{error}</p>}
            {menuText.length > 0 && (
                <>
                    <div className="flex flex-wrap mt-5">
                        {menuText.map((item, index) => (
                            <div key={index} className="border border-gray-300 rounded-lg p-2 m-2 w-1/2 bg-gray-50">
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5">
                        <h2 className="text-xl font-bold mb-3">Chatbot</h2>
                        <div className="border border-gray-300 rounded-lg p-2 h-72 overflow-y-scroll bg-gray-50">
                            {messages.map((message, index) => (
                                <div key={index} className="mb-2">
                                    <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong> {message.content}
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="w-full p-2 mt-2 rounded-lg border border-gray-300"
                        />
                        <button onClick={handleSendMessage} className="w-full p-2 mt-2 bg-blue-500 text-white rounded-lg">Send</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DropzonePage;