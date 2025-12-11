import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  // Convert file → Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const summarizeAudio = async () => {
    if (!file) return alert("Upload an audio file first!");

    const base64 = await toBase64(file);

    try {
      const ai = new GoogleGenerativeAI({
        apiKey: "AIzaSyCF07lNfYLaDI7pEkVWW5fbXHtZvwOqVEk",
      });

      const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent([
        { text: "Summarize this audio in 3 sentences." },
        {
          inlineData: {
            mimeType: file.type,
            data: base64.split(",")[1], // Remove "data:*/*;base64,"
          },
        },
      ]);

      setData(result.response.text());
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // File selection handler
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setAudioURL(URL.createObjectURL(uploadedFile)); // preview audio
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎵 Audio Summarizer</h1>

      {/* Upload Input */}
      <input type="file" accept="audio/*" onChange={handleFileUpload} />

      {/* Audio Preview */}
      {audioURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Preview Audio:</h3>
          <audio controls src={audioURL}></audio>
        </div>
      )}

      {/* Summarize Button */}
      <button onClick={summarizeAudio} style={{ marginTop: 20 }}>
        Summarize Audio
      </button>

      {/* Output */}
      {data && (
        <div style={{ marginTop: 20 }}>
          <h3>Summary:</h3>
          <p>{data}</p>
        </div>
      )}
    </div>
  );
};

export default App;
