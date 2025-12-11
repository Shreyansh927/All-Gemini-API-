import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AudioSummarizer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [summary, setSummary] = useState("");

  // Convert uploaded file → Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const summarizeAudio = async () => {
    if (!audioFile) {
      alert("Please upload an audio file");
      return;
    }

    try {
      const base64Audio = await toBase64(audioFile);

      const genAI = new GoogleGenerativeAI(
        "AIzaSyCF07lNfYLaDI7pEkVWW5fbXHtZvwOqVEk"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const response = await model.generateContent([
        { text: "Please summarize the audio." },
        {
          inlineData: {
            mimeType: audioFile.type,
            data: base64Audio,
          },
        },
      ]);

      setSummary(response.response.text());
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎧 Gemini Audio Summarizer</h2>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={summarizeAudio}>Summarize Audio</button>

      <h3>📌 Summary:</h3>
      <p>{summary || "No summary yet."}</p>
    </div>
  );
};

export default AudioSummarizer;
