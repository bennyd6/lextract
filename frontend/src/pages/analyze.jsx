import React, { useState, useRef, useEffect } from 'react';
import './analyze.css';
import su from '../assets/submit.png';
import d from '../assets/download.png'
import e from '../assets/email.png'
import c from '../assets/chatbot.png'

export default function Analyze() {
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [currentStage, setCurrentStage] = useState(-1);
    const [resultJson, setResultJson] = useState(null);

    const inputRef = useRef(null);

    const stages = ['Extracting', 'Detecting', 'Parsing', 'Structuring', 'Analyzing'];

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => e.preventDefault();
    const handleClick = () => inputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleClear = () => {
        setImage(null);
        inputRef.current.value = null;
        setAnalyzing(false);
        setCurrentStage(-1);
    };

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setCurrentStage(0);
        let stageIndex = 0;
    
        const interval = setInterval(() => {
            stageIndex++;
            if (stageIndex < stages.length) {
                setCurrentStage(stageIndex);
            } else {
                clearInterval(interval);
            }
        }, 1400); // total 7 seconds
    
        // Wait a bit before sending the image (can be parallelized later)
        setTimeout(async () => {
            const fileInput = inputRef.current;
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                const res = await fetch("http://localhost:5000/analyze", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                setResultJson(data.json);
            } catch (error) {
                console.error("Error analyzing image:", error);
                setResultJson("Something went wrong. Try again.");
            }
        }, 1000); // Send after 1s
    };    

    return (
        <div className="analyze-main">
            <div className="a-top">

            </div>
            <div className={`a-1-wrapper ${image ? 'uploaded' : ''}`}>
                <div
                    className={`a-1 ${image ? 'shrink-left' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={!image ? handleClick : undefined}
                >
                    {image ? (
                        <img src={image} alt="Uploaded Preview" className="preview-img" />
                    ) : (
                        <>
                            <div className="a-1-1">
                                <img src={su} alt="upload-icon" />
                            </div>
                            <div className="divider"></div>
                            <div className="a-1-2">
                                <p>Drag and Drop your image here</p>
                                <p>or</p>
                                <p>Click here to upload</p>
                            </div>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>

                {image && (
                    <div className="button-group">
                        <button className="action-btn media-object analyze" onClick={handleAnalyze}>
                            Analyze Image
                        </button>
                        <button className="action-btn media-clear media-object clear" onClick={handleClear}>
                            Clear Image
                        </button>
                    </div>
                )}
            </div>
            {analyzing && (
            <div className="a-2">
                <div className="stage-progress">
                    {stages.map((stage, index) => (
                        <div
                            key={index}
                            className={`stage ${index === currentStage ? 'active' : index < currentStage ? 'done' : ''}`}
                        >
                            <div className="dot"></div>
                            <span className="label">{stage}</span>
                        </div>
                    ))}
                    <div className="progress-line">
                        <div
                            className="line-fill"
                            style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                            ></div>
                    </div>
                </div>
            </div>
            )}
            {resultJson && (
                            <>
                <div className="a-3">
  <h3>Structured Data:</h3>
  {(() => {
    try {
      // Remove markdown code fences if present
      const cleaned = typeof resultJson === 'string'
        ? resultJson.replace(/```json|```/g, '').trim()
        : JSON.stringify(resultJson);

      const data = JSON.parse(cleaned);

      return (
        <table className="structured-table">
          <tbody>
            <tr>
              <th>Client Name</th>
              <td>{data["Client name"] || 'N/A'}</td>
            </tr>
            <tr>
              <th>PAN</th>
              <td>{data["PII data"]?.PAN?.join(', ') || 'N/A'}</td>
            </tr>
            <tr>
              <th>AADHAAR</th>
              <td>{data["PII data"]?.AADHAAR?.join(', ') || 'N/A'}</td>
            </tr>
            <tr>
              <th>GSTIN</th>
              <td>{data["PII data"]?.GSTIN?.join(', ') || 'N/A'}</td>
            </tr>
            <tr>
              <th>Nature of Notice</th>
              <td>{data["Nature of notice"] || 'N/A'}</td>
            </tr>
            <tr>
              <th>Deadlines and Penalties</th>
              <td>{data["Deadlines and penalties"] || 'N/A'}</td>
            </tr>
            <tr>
              <th>Reporting Officer/Office</th>
              <td>{data["Reporting officer/office"] || 'N/A'}</td>
            </tr>
            <tr>
              <th>Relevant Legal Sections</th>
              <td>{data["Relevant legal sections"] || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      );
    } catch (error) {
      return <p style={{ color: 'red' }}>Error Analyzing the Document{error.message}</p>;
    }
  })()}
</div>
<div className="a-4">
    <img src={d} alt="" />
    <img src={e} alt="" />
    <img src={c} alt="" />
</div>
</>

)}

        </div>
    );
}