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
            } else {
                setError("Failed to extract text from the image.");
            }
            setError(null); // Clear any errors
        } catch (err) {
            console.error("OCR Error:", err);
            setError("Failed to extract text from the image.");
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
        <div style={{ padding: '20px' }}>
            <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
                <input {...getInputProps()} type="file" />
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
            </div>
            <button onClick={handleExtractText} style={{ marginTop: '20px' }}>Extract Text</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {menuText.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                    {menuText.map((item, index) => (
                        <div key={index} style={{ border: '1px solid #cccccc', borderRadius: '8px', padding: '10px', margin: '10px', width: '200px' }}>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                <h2>Chatbot</h2>
                <div style={{ border: '1px solid #cccccc', borderRadius: '8px', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                    {messages.map((message, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong> {message.content}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    style={{ width: 'calc(100% - 22px)', padding: '10px', marginTop: '10px' }}
                />
                <button onClick={handleSendMessage} style={{ marginTop: '10px' }}>Send</button>
            </div>
            {error && (
                <div style={{ color: "red", marginTop: "20px" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
};

export default DropzonePage;
