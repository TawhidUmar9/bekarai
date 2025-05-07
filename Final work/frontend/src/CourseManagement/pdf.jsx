import React, { useState, useEffect } from "react";
import axios from "axios";

const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState(
    "https://www.vssut.ac.in/lecture_notes/lecture1424354156.pdf"
  );
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the prompt to the backend here
    // For now, just simulate a response
    setResponse(`Backend response: ${prompt}`);
  };

  //  useEffect(() => {
  //  const fetchPdf = async () => {
  //  try {
  //  const response = await axios.get('/api/pdf'); // Replace with your backend API endpoint
  //  if (response.data) {
  //  setPdfUrl(response.data);
  //  }
  //  } catch (error) {
  //  console.error(error);
  //  }
  //  };
  //  fetchPdf();
  //  }, []);

  return (
    <div>
      {pdfUrl ? (
        <embed src={pdfUrl} type="application/pdf" width="100%" height="700" />
      ) : (
        <p>Loading...</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a prompt..."
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default PdfViewer;
