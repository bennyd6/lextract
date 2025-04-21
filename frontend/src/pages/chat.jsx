import React, { useState } from "react";
import axios from "axios";

function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const startListening = () => {
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setMessage(spokenText);
      sendMessage(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
  };

  const sendMessage = async (text) => {
    setLoading(true);
    try {
      const res = await axios.post("https://lextract.onrender.com/chat", { message: text });
      const botResponse = res.data.response;
      setResponse(botResponse);
      speak(botResponse);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div style={{
      fontFamily: "Segoe UI, Roboto, sans-serif",
      background: "radial-gradient(circle at top, #222, #000)",
      color: "#fff",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "2rem",
    }}>
      <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem", color: "#61dafb" }}>Voice Chat</h1>

      {/* Mic Button */}
      <div
        onClick={isListening ? stopListening : startListening}
        style={{
          width: "100px",
          height: "100px",
          background: isListening ? "#1db954" : "#333",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: isListening ? "0 0 20px #1db954, 0 0 40px #1db954" : "0 0 10px #555",
          cursor: "pointer",
          animation: isListening ? "pulse 1.2s infinite" : "none",
          transition: "0.3s ease-in-out",
        }}
      >
        <span style={{ fontSize: "2rem" }}>{isListening ? "🎧" : "🎙"}</span>
      </div>

      {/* Response Display */}
      <div style={{
        marginTop: "2rem",
        backgroundColor: "#1e1e1e",
        padding: "1.5rem",
        borderRadius: "10px",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 0 15px rgba(0,0,0,0.6)"
      }}>
        <p><strong></strong> {message || <i>Ask a query about your document</i>}</p>
        <p><strong>Bot:</strong> {
          loading ? <span style={{ color: "#61dafb" }}>Loading...</span> :
          response || <i>Waiting for input...</i>
        }</p>
      </div>

      {/* Stop Speaking Button */}
      <button
        onClick={stopSpeaking}
        disabled={!isSpeaking}
        style={{
          marginTop: "1rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#fca311",
          border: "none",
          borderRadius: "8px",
          color: "#000",
          fontWeight: "bold",
          cursor: isSpeaking ? "pointer" : "not-allowed",
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        }}
      >
        🔇 Stop Speaking
      </button>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(29,185,84, 0.4);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(29,185,84, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(29,185,84, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default Chat;