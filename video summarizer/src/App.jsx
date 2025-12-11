import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [data, setData] = useState("null");
  const [file, setFile] = useState(null);

  const api = async () => {
    if (!file) return alert("Upload a video first!");

    const base64 = await toBase64(file);

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyDIKhIVJ5FqX_juhuuFGXoLVv18f197-JE"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent([
        "Summarize the video in 3 sentences.",
        {
          inlineData: {
            mimeType: file.type,
            data: base64.split(",")[1], // remove "data:...;base64,"
          },
        },
      ]);

      setData(result.response.text());
    } catch (err) {
      console.log("error", err);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  return (
    <div>
      <h1>ans: {data}</h1>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={api}>Summarize Video</button>
    </div>
  );
};

export default App;
