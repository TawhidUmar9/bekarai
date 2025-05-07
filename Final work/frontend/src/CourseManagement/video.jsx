import React, { useState } from "react";
import YouTube from "react-youtube";

const Video = () => {
  const videoId = "KJgsSFOSQv0";
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the prompt to the backend here
    // For now, just simulate a response
    setResponse(`Backend response: ${prompt}`);
  };

  const opts = {
    height: "390",
    width: "640",
  };

  return (
    <div>
      <YouTube videoId={videoId} opts={opts} />
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

export default Video;
