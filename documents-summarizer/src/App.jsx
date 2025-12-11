import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [data, setData] = useState("Summary will appear here");
  const [file, setFile] = useState(null);

  // Convert file to base64 string
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const summarizePDF = async () => {
    if (!file) return alert("Please upload a PDF file!");

    const base64String = await toBase64(file);

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCF07lNfYLaDI7pEkVWW5fbXHtZvwOqVEk"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent([
        "Summarize this document in 3 sentences.",
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64String.split(",")[1], // Remove `data:application/pdf;base64,`
          },
        },
      ]);

      const text = await result.response.text();
      setData(text);
    } catch (error) {
      console.error("Gemini error:", error);
      setData("Failed to summarize. Check console for errors.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>PDF Summarizer with Gemini AI</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={summarizePDF} style={{ marginTop: "1rem" }}>
        Summarize PDF
      </button>

      <div style={{ marginTop: "2rem", whiteSpace: "pre-wrap" }}>
        <strong>Summary:</strong>
        <p>{data}</p>
      </div>
    </div>
  );
};

export default App;
