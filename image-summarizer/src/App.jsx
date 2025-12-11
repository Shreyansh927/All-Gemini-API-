import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const App = () => {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  // Convert uploaded file → Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const generateCaption = async () => {
    if (!image) return alert("Please upload an image first!");

    setLoading(true);

    try {
      const base64 = await toBase64(image);

      const genAI = new GoogleGenerativeAI(
        "AIzaSyCF07lNfYLaDI7pEkVWW5fbXHtZvwOqVEk"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: image.type, // e.g., image/jpeg
            data: base64,
          },
        },
        { text: "Please caption this image." },
      ]);

      setCaption(result.response.text());
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate caption.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Image Caption Generator</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={generateCaption} disabled={loading}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>

      <h3 style={{ marginTop: 20 }}>Caption:</h3>
      <p>{caption}</p>

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          width={300}
          style={{ marginTop: 20 }}
        />
      )}
    </div>
  );
};

export default App;
